<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="查询时间：">
            <el-date-picker
              v-model="createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00']"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="orderTable"
        :data="list"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column label="活跃用户UV" align="center">
          <template slot-scope="scope">{{scope.row.openAppUv}}</template>
        </el-table-column>
        <el-table-column label="点击活动UV" align="center">
          <template slot-scope="scope">{{scope.row.openActivityUv}}</template>
        </el-table-column>
        <el-table-column label="点击抽奖UV" align="center">
          <template slot-scope="scope">{{scope.row.openLuckdrawUv}}</template>
        </el-table-column>
        <el-table-column label="点击红包UV" align="center">
          <template slot-scope="scope">{{scope.row.openRedbagUv}}</template>
        </el-table-column>
        <el-table-column label="优惠券弹窗点击UV" align="center">
          <template slot-scope="scope">{{scope.row.openPopcouponUv}}</template>
        </el-table-column>
        <el-table-column label="点击商品UV" align="center">
          <template slot-scope="scope">{{scope.row.clickGoodsUv}}</template>
        </el-table-column>
        <el-table-column label="点击购买UV" align="center">
          <template slot-scope="scope">{{scope.row.clickBuyUv}}</template>
        </el-table-column>
        <el-table-column label="加购UV" align="center">
          <template slot-scope="scope">{{scope.row.addCartUv}}</template>
        </el-table-column>
        <el-table-column label="创建订单数" align="center">
          <template slot-scope="scope">{{scope.row.createOrders}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchReportList } from "@/api/statics";
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  statDateGe: null,
  statDateLe: null
};
export default {
  name: "userList",
  components: { LogisticsDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      createTime: null,
      isSendGift: false,
      sendQuery: {
        id: null,
        amount: null,
        password: null
      }
    };
  },
  created() {
    this.listQuery.statDateGe = this.formatTime(new Date());
    this.listQuery.statDateLe = this.formatTime(new Date());
    this.createTime = [this.listQuery.statDateGe, this.listQuery.statDateLe];
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      if (!time) return
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    formatTime(time) {
      if (!time) return
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:00");
    },
    sendGiftConfim(row) {
      this.isSendGift = true;
      this.sendQuery.id = row.id;
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.statDateGe = this.formatTime(this.createTime[0]);
      this.listQuery.statDateLe = this.formatTime(this.createTime[1]);
      this.listQuery.pageNum = 1;
      this.searchStatus = this.listQuery.status;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleViewOrder(index, row) {
      this.$router.push({ path: "/oms/orderDetail", query: { id: row.id } });
    },
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleViewDelivery(id) {
      viewDelivery(id).then(response => {
        const list = response.data.list;
        this.viewDeliveryDilog = true;
        this.deliveryList = list;
        console.log(this.deliveryList);
      });
    },
    handleDeliveryOrder(index, row) {
      let listItem = this.covertOrder(row);
      this.$router.push({
        path: "/oms/deliverOrderList",
        query: { list: [listItem] }
      });
    },
    handleViewLogistics(index, row) {
      this.logisticsDialogVisible = true;
    },
    handleDeleteOrder(index, row) {
      let ids = [];
      ids.push(row.id);
      this.deleteOrder(ids);
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleCloseOrderConfirm() {
      if (this.closeOrder.content == null || this.closeOrder.content === "") {
        this.$message({
          message: "操作备注不能为空",
          type: "warning",
          duration: 1000
        });
        return;
      }
      let params = new URLSearchParams();
      params.append("ids", this.closeOrder.orderIds);
      params.append("note", this.closeOrder.content);
      closeOrder(params).then(response => {
        this.closeOrder.orderIds = [];
        this.closeOrder.dialogVisible = false;
        this.getList();
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    getList() {
      this.listLoading = true;
      fetchReportList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data;
        this.list.forEach(element => {
          element.statDate = formatDate(new Date(element.statDate),"yyyy-MM-dd");
        });
        this.total = response.data.total;
      });
    }
  }
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>


