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
          <el-form-item label="父订单号：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="父订单编号"></el-input>
          </el-form-item>
          <el-form-item label="子订单号：">
            <el-input v-model="listQuery.subOrderSn" class="input-width" placeholder="子订单编号"></el-input>
          </el-form-item>
          <el-form-item label="收货人电话：">
            <el-input v-model="listQuery.receiverPhone" class="input-width" placeholder="会员名称"></el-input>
          </el-form-item>
          <el-form-item label="收 货 人：">
            <el-input
              v-model="listQuery.receiverNameSearch"
              class="input-width"
              placeholder="收货人姓名"
            ></el-input>
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
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>历史导出记录</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <!-- <el-table-column type="selection"  align="center"></el-table-column> -->
        <el-table-column label="操作时间" align="center">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">{{scope.row.subOrderSn}}</template>
        </el-table-column>
        <el-table-column label="导出条件" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-button
        class="search-button"
        @click="exportUnshippedOrderItem()"
        type="primary"
        size="small"
      >导出未发货订单</el-button>
      <el-upload
        style="display:inline-block"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="handleChange"
        :file-list="fileList"
        :multiple="false"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button size="small" type="primary" @click="uploadFile()">导入物流信息</el-button>
      <a href="http://www.keke66.cn/downLoadFile/物流模板.xlsx" download="物流上传模板.xlsx">
        <el-button class="search-button" type="primary" size="small">下载Excel模板</el-button>
      </a>
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
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
import {
  fetchHistoryList,
  closeOrder,
  deleteOrder,
  exportUnshippedOrderItem,
  uploadFile
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
  status: 0,
  nicknameSearch: ""
};
const xxurl = process.env.BASE_API+'/localFile/upload';
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
      logisticsDialogVisible: false,
      filesUrl: "",
      fileList: [],
      xxurl:xxurl
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
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
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
    exportUnshippedOrderItem() {
      exportUnshippedOrderItem(this.listQuery).then(response => {
        console.log(response);
        const fileKey = response.data.fileKey;
        window.location.href =
          process.env.BASE_API + "/localFile/download?fileKey=" + fileKey;
      });
    },
    uploadFile(){
      uploadFile(this.fileList[0]).then(response=>{

      })
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
      fetchHistoryList({}).then(response => {
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

<style>
.app-container ul.el-upload-list {
  display: inline-block;
  padding-top: 10px;
}
</style>


