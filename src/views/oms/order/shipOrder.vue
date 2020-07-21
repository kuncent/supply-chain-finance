<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
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
            <!-- <el-date-picker
              class="input-width"
              v-model="listQuery.createTimeGe"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
            ></el-date-picker>-->
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
      <el-button
        class="search-button"
        @click="exportUnshippedOrderItem()"
        type="primary"
        size="small"
      >导出未发货订单</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="操作时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="导出条件" align="center">
          <template slot-scope="scope">{{scope.row.params}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-upload
        style="display:inline-block"
        action="http://mty-youquan.oss-cn-shenzhen.aliyuncs.com"
        :data="dataObj"
        :on-change="handleChange"
        :file-list="fileList"
        :multiple="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      >
        <el-button size="small" type="primary">导入物流信息</el-button>
      </el-upload>
      <a href="http://www.keke66.cn/downLoadFile/物流模板.xlsx" download="物流上传模板.xlsx">
        <el-button class="search-button" type="primary" size="small">下载Excel模板</el-button>
      </a>
    </div>
    <el-dialog title="导入物流信息结果" :visible.sync="isUploadSucc" width="40%">
      <el-form :inline="true" :model="uploadSuccOptions" size="small" label-width="140px">
        <el-form-item label="发货子订单数量：">
          <el-input
            v-model="uploadSuccOptions.shipping"
            class="input-width"
            placeholder="父订单编号"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="更新物流单号数量：">
          <el-input
            v-model="uploadSuccOptions.update"
            class="input-width"
            placeholder="父订单编号"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="失败数量：">
          <el-input
            v-model="uploadSuccOptions.fail"
            class="input-width"
            placeholder="父订单编号"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUploadSucc = false">取 消</el-button>
        <el-button type="primary" @click="isUploadSucc = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <logistics-dialog v-model="handleIsExport"></logistics-dialog> -->
  </div>
</template>
<script>
import {
  fetchHistoryList,
  closeOrder,
  deleteOrder,
  exportUnshippedOrderItem,
  uploadFile,
  importShippingByUrl
} from "@/api/order";
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
import { policy } from "@/api/oss";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderSn: null,
  receiverNameSearch: "",
  status: null,
  orderType: null,
  sourceType: null,
  createTimeGe: null,
  createTimeLe: null,
  status: 0,
  nicknameSearch: ""
};
const xxurl = process.env.BASE_API + "/localFile/upload";
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
      isUploadSucc: false,
      uploadSuccOptions: {
        fail: 0,
        shipping: 0,
        update: 0
      },
      searchStatus: 0,
      logisticsDialogVisible: false,
      filesUrl: "",
      fileList: [],
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: ""
      },
      listObj: {},
      createTime: null,
      isExport: false
    };
  },
  created() {
    var now = new Date();
    var start = new Date(0, 0, 0, 0, 0, 0, 0);
    var millisSepcil = now - start - 3600 * 1000 * 2.1;
    var millis = now - start - 3600 * 1000 * 24 * 7 - 360 * 1000;
    var weekHoursAgo = new Date(0, 0, 0, 0, 0, 0, millis);
    var twoHoursAgo = new Date(0, 0, 0, 0, 0, 0, millisSepcil);
    this.createTime = [weekHoursAgo, twoHoursAgo];
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      console.log(formatDate(date, "yyyy-MM-dd hh:mm:ss"));
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    handleIsExport() {},
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    handleSuccess(response, file) {
      const url = this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name;
      importShippingByUrl({ url }).then(response => {
        if (response.code === 200) {
          this.uploadSuccOptions = response.data;
          this.isUploadSucc = true;
          this.handleSearchList();
        }
      });
    },
    beforeUpload(file) {
      const _self = this;
      const fileName = file.uid;
      this.listObj[fileName] = {};
      return new Promise((resolve, reject) => {
        policy()
          .then(response => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + "/${filename}";
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            _self.listObj[fileName] = {
              hasSuccess: false,
              uid: file.uid,
              width: this.width,
              height: this.height
            };
            resolve(true);
          })
          .catch(err => {
            console.log(err);
            reject(false);
          });
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
      const createTime = this.createTime;
      if (createTime) {
        this.listQuery.createTimeGe = formatDate(
          createTime[0],
          "yyyy-MM-dd hh:mm:ss"
        );
        this.listQuery.createTimeLe = formatDate(
          createTime[1],
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      console.log(this.listQuery);
      exportUnshippedOrderItem(this.listQuery).then(response => {
        const fileKey = response.data.fileKey;
        window.location.href = fileKey;
      });
    },
    uploadFile() {
      uploadFile(this.fileList[0]).then(response => {});
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
        this.list = response.data;
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


