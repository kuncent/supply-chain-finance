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
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="用户Id"></el-input>
          </el-form-item>
          <el-form-item label="openId：">
            <el-input v-model="listQuery.subOrderSn" class="input-width" placeholder="openId"></el-input>
          </el-form-item>
          <el-form-item label="昵称：">
            <el-input v-model="listQuery.nicknameSearch" class="input-width" placeholder="昵称"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="listQuery.receiverNameSearch" class="input-width" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item label="父订单：">
            <el-input v-model="listQuery.nicknameSearch" class="input-width" placeholder="父订单号"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTimeGe"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="发货时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.deliveryTimeGe"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
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
        <el-table-column label="提交时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="用户Id" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="openId" align="center">
          <template slot-scope="scope">{{scope.row.nickname}}</template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{scope.row.productName}}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{scope.row.productId}}</template>
        </el-table-column>
        <el-table-column label="商品货号" align="center">
          <template slot-scope="scope">{{scope.row.productSn}}</template>
        </el-table-column>
        <el-table-column label="sku编号" align="center">
          <template slot-scope="scope">{{scope.row.productSkuId}}</template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template slot-scope="scope">{{scope.row.productAttrShow}}</template>
        </el-table-column>
        <el-table-column label="购买数量" width="120" align="center">
          <template slot-scope="scope">{{scope.row.productQuantity}}</template>
        </el-table-column>
        <el-table-column label="商品单价" width="120" align="center">
          <template slot-scope="scope">{{scope.row.productPrice}}</template>
        </el-table-column>
        <el-table-column label="结算价" width="120" align="center">
          <template slot-scope="scope">{{scope.row.costPrice}}</template>
        </el-table-column>
        <el-table-column label="付款金额" width="120" align="center">
          <template slot-scope="scope">{{scope.row.totalAmount}}</template>
        </el-table-column>
        <el-table-column label="所属店铺" width="120" align="center">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <el-table-column label="商品分类" width="120" align="center">
          <template slot-scope="scope">{{scope.row.productCategoryId}}</template>
        </el-table-column>
        <el-table-column label="付款时间" width="120" align="center">
          <template slot-scope="scope">{{scope.row.paymentTime}}</template>
        </el-table-column>
        <el-table-column label="发货时间" width="120" align="center">
          <template slot-scope="scope">{{scope.row.deliveryTime}}</template>
        </el-table-column>
        <el-table-column label="收货人" width="120" align="center">
          <template slot-scope="scope">{{scope.row.receiverName}}</template>
        </el-table-column>
        <el-table-column label="收货人手机" width="120" align="center">
          <template slot-scope="scope">{{scope.row.receiverPhone}}</template>
        </el-table-column>
        <el-table-column label="确认收货时间" width="120" align="center">
          <template slot-scope="scope">{{scope.row.receiveTime}}</template>
        </el-table-column>
        <el-table-column label="完成时间" width="120" align="center">
          <template slot-scope="scope">{{scope.row.completeTime}}</template>
        </el-table-column>
        <el-table-column label="订单备注" width="120" align="center">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">{{statusTips[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewDelivery(scope.row.id)"
              v-show="scope.row.status > 1"
            >查看物流</el-button>
            <el-button
              size="mini"
              @click="handleRefund(scope.row.id)"
              v-show="scope.row.status===1 || scope.row.status===2||scope.row.status===3"
            >退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small"
      >确定</el-button>
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
    <el-dialog title="关闭订单" :visible.sync="closeOrder.dialogVisible" width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrder.content"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看订单" :visible.sync="viewDeliveryDilog" width="30%">
      <div style="height: 300px;">
        <el-steps style="height:300px;overflow-y: auto;" direction="vertical" :active="1">
          <el-step v-for="(item, index) in deliveryList" :key="index" :title="item.status"></el-step>
        </el-steps>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDeliveryDilog = false">取 消</el-button>
        <el-button type="primary" @click="viewDeliveryDilog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="确定退款" :visible.sync="isRefundConfim" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="isRefundConfim = false">取 消</el-button>
        <el-button type="primary" @click="refundConfim">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  closeOrder,
  deleteOrder,
  exportUnshippedOrderItem,
  viewDelivery,
  fetcRefund
} from "@/api/order";
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderSn: null,
  receiverNameSearch: "",
  status: null,
  orderType: null,
  sourceType: null,
  createTimeGe: null,
  deliveryTimeGe: null,
  status: "",
  nicknameSearch: ""
};
export default {
  name: "childOrder",
  components: { LogisticsDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: []
      },
      searchStatus: 0,
      statusTips: {
        "0": "待付款",
        "1": "待发货",
        "2": "已发货",
        "3": "已完成",
        "4": "已关闭"
      },
      statusOptions: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待付款",
          value: 0
        },
        {
          label: "待发货",
          value: 1
        },
        {
          label: "已发货",
          value: 2
        },
        {
          label: "已完成",
          value: 3
        },
        {
          label: "已关闭",
          value: 4
        }
      ],
      orderTypeOptions: [
        {
          label: "正常订单",
          value: 0
        },
        {
          label: "秒杀订单",
          value: 1
        }
      ],
      sourceTypeOptions: [
        {
          label: "PC订单",
          value: 0
        },
        {
          label: "APP订单",
          value: 1
        }
      ],
      operateOptions: [
        {
          label: "批量发货",
          value: 1
        },
        {
          label: "关闭订单",
          value: 2
        },
        {
          label: "删除订单",
          value: 3
        }
      ],
      logisticsDialogVisible: false,
      viewDeliveryDilog: false,
      deliveryList: [],
      isRefundConfim: false,
      refundId: null
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatPayType(value) {
      if (value === 1) {
        return "支付宝";
      } else if (value === 2) {
        return "微信";
      } else {
        return "未支付";
      }
    },
    formatSourceType(value) {
      if (value === 1) {
        return "APP订单";
      } else {
        return "PC订单";
      }
    },
    formatStatus(value) {
      if (value === 1) {
        return "待发货";
      } else if (value === 2) {
        return "已发货";
      } else if (value === 3) {
        return "已完成";
      } else if (value === 4) {
        return "已关闭";
      } else if (value === 5) {
        return "无效订单";
      } else {
        return "待付款";
      }
    }
  },
  methods: {
    handleRefund(id) {
      this.isRefundConfim = true;
      this.refundId = id;
    },
    refundConfim() {
      fetcRefund({ id: this.refundId }).then(response => {});
      this.isRefundConfim = false;
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
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的订单",
          type: "warning",
          duration: 1000
        });
        return;
      }
      if (this.operateType === 1) {
        //批量发货
        let list = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === 1) {
            list.push(this.covertOrder(this.multipleSelection[i]));
          }
        }
        if (list.length === 0) {
          this.$message({
            message: "选中订单中没有可以发货的订单",
            type: "warning",
            duration: 1000
          });
          return;
        }
        this.$router.push({
          path: "/oms/deliverOrderList",
          query: { list: list }
        });
      } else if (this.operateType === 2) {
        //关闭订单
        this.closeOrder.orderIds = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.closeOrder.orderIds.push(this.multipleSelection[i].id);
        }
        this.closeOrder.dialogVisible = true;
      } else if (this.operateType === 3) {
        //删除订单
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteOrder(ids);
      }
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
    },
    deleteOrder(ids) {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteOrder(params).then(response => {
          this.$message({
            message: "删除成功！",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    covertOrder(order) {
      let address =
        order.receiverProvince +
        order.receiverCity +
        order.receiverRegion +
        order.receiverDetailAddress;
      let listItem = {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: address,
        deliveryCompany: null,
        deliverySn: null
      };
      return listItem;
    }
  }
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>


