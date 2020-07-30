<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleSelectProduct()">添加店铺</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="newProductTable"
        :data="list"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column label="id" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="选择商品" :visible.sync="selectDialogVisible" width="50%">
      <el-input
        v-model="dialogData.listQuery.keyword"
        style="width: 250px;margin-bottom: 20px"
        size="small"
        placeholder="商品名称搜索"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch()"></el-button>
      </el-input>
      <el-table :data="dialogData.list" @selection-change="handleDialogSelectionChange" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="货号" width="160" align="center">
          <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleDialogSizeChange"
          @current-change="handleDialogCurrentChange"
          layout="prev, pager, next"
          :current-page.sync="dialogData.listQuery.pageNum"
          :page-size="dialogData.listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :total="dialogData.total"
        ></el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button size="small" @click="selectDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加店铺" :visible.sync="isAddDialog" width="40%">
      <el-form :model="addOptions" label-width="100px">
        <el-form-item label="名称：">
          <el-input v-model="addOptions.name" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isAddDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAddTag" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑店铺" :visible.sync="isEditDialog" width="40%">
      <el-form :model="addOptions" label-width="100px">
        <el-form-item label="名称：">
          <el-input v-model="addOptions.name" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isEditDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateAddTag" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  createShops,
  updateShops
} from "@/api/shops";
import { fetchList as fetchProductList } from "@/api/product";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  nameSearch: ""
};
const defaultRecommendOptions = [
  {
    label: "未推荐",
    value: 0
  },
  {
    label: "推荐中",
    value: 1
  }
];
const defaultAddOptions = {
  name: ""
};
export default {
  name: "hotProductList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      recommendOptions: Object.assign({}, defaultRecommendOptions),
      addOptions: Object.assign({}, defaultAddOptions),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      operateType: null,
      selectDialogVisible: false,
      dialogData: {
        list: null,
        total: null,
        multipleSelection: [],
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 10
        }
      },
      isAddDialog: false,
      isEditDialog: false,
      sortDialogVisible: false,
      sortDialogData: { sort: 0, id: null }
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatRecommendStatus(status) {
      if (status === 1) {
        return "显示";
      } else {
        return "不显示";
      }
    }
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    handleDelete(index, row) {
      this.$router.push({ path: "/sms/selectAdd", query: { id: row.id } });
    },
    handleSelectProduct() {
      this.isAddDialog = true;
      this.addOptions = Object.assign({}, defaultAddOptions);
    },
    handleAddTag() {
      this.isAddDialog = false;
      createShops(this.addOptions).then(response => {
        if (response.code === 200) {
          this.getList();
        }
      });
    },
    handleDialogSizeChange(val) {
      this.dialogData.listQuery.pageNum = 1;
      this.dialogData.listQuery.pageSize = val;
      this.getDialogList();
    },
    handleDialogCurrentChange(val) {
      this.dialogData.listQuery.pageNum = val;
      this.getDialogList();
    },
    handleDialogSelectionChange(val) {
      this.dialogData.multipleSelection = val;
    },
    handleEdit(index, row) {
      this.isEditDialog = true;
      this.addOptions = Object.assign({}, row);
    },
    updateAddTag() {
      this.isEditDialog = false;
      updateShops(this.addOptions, this.addOptions.id).then(response => {
        this.getList();
      });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data;
        this.total = response.data.total;
      });
    },
  }
};
</script>
<style></style>
