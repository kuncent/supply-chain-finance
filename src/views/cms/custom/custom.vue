<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户Id：">
            <el-input v-model="listQuery.id" class="input-width" placeholder="用户Id"></el-input>
          </el-form-item>
          <el-form-item label="openId：">
            <el-input v-model="listQuery.username" class="input-width" placeholder="openId"></el-input>
          </el-form-item>
          <el-form-item label="昵称：">
            <el-input v-model="listQuery.nicknameSearch" class="input-width" placeholder="昵称"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="listQuery.phone" class="input-width" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item label="父订单：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="父订单号"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              v-model="createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
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
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="用户Id" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="openId" align="center">
          <template slot-scope="scope">{{scope.row.nickname}}</template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="头像" width="120" align="center">
          <template slot-scope="scope">
            <img style="height: 80px" :src="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column label="礼品卡余额" align="center">
          <template slot-scope="scope">{{scope.row.giftAmount}}</template>
        </el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="sendGiftConfim(scope.row)"
              v-show="scope.row.status===1 || scope.row.status===2||scope.row.status===3"
            >发放礼品卡</el-button>
          </template>
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
    <el-dialog title="确定退款" :visible.sync="isSendGift" width="30%">
      <p>给用户【{{this.sendQuery.id}}】发放礼品卡</p>
      <el-form :inline="true" :model="sendQuery" size="small" label-width="140px">
        <el-form-item label="金额：">
          <el-input v-model="sendQuery.amount" class="input-width" placeholder="金额"></el-input>
        </el-form-item>
        <el-form-item label="当前账号密码：">
          <el-input
            v-model="sendQuery.password"
            class="input-width"
            placeholder="当前账号密码："
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSendGift = false">取 消</el-button>
        <el-button type="primary" @click="handSendGift">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, sendGift } from "@/api/user";
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  id: null,
  orderSn: null,
  username: null,
  createTimeGe: null,
  createTimeLe: null,
  nicknameSearch: null,
  phone: null
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
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    sendGiftConfim(row) {
      this.isSendGift = true;
      this.sendQuery.id = row.id;
    },
    handSendGift() {
      sendGift(this.sendQuery).then(response => {
        if (response.code === 200) {
          this.isSendGift = false;
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getList();
        }
      });
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
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
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
        console.log(this.list);
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


