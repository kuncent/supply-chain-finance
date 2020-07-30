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
          <el-form-item label="标签名称：">
            <el-input v-model="listQuery.nameSearch" class="input-width" placeholder="标签名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleSelectProduct()">添加标签</el-button>
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
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="id" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="副标题" align="center">
          <template slot-scope="scope">{{scope.row.subTitle}}</template>
        </el-table-column>
        <el-table-column label="显示状态" align="center">
          <template slot-scope="scope">{{scope.row.showStatus | formatRecommendStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">管理优选商品</el-button>
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
    <el-dialog title="设置排序" :visible.sync="sortDialogVisible" width="40%">
      <el-form :model="sortDialogData" label-width="150px">
        <el-form-item label="排序：">
          <el-input v-model="sortDialogData.sort" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdateSort" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加商品标签" :visible.sync="isAddDialog" width="40%">
      <el-form :model="addOptions" label-width="100px">
        <el-form-item label="名称：">
          <el-input v-model="addOptions.name" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="副标题：">
          <el-input v-model="addOptions.subTitle" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch :active-value="1" :inactive-value="0" v-model="addOptions.showStatus"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isAddDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAddTag" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑商品标签" :visible.sync="isEditDialog" width="40%">
      <el-form :model="addOptions" label-width="100px">
        <el-form-item label="名称：">
          <el-input v-model="addOptions.name" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="副标题：">
          <el-input v-model="addOptions.subTitle" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch :active-value="1" :inactive-value="0" v-model="addOptions.showStatus"></el-switch>
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
  updateRecommendStatus,
  deleteHotProduct,
  createHotProduct,
  updateHotProductSort,
  createTag,
  updateTag
} from "@/api/selectProduct";
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
  name: "",
  subTitle: "",
  showStatus: 1,
  sort: 0
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
      operates: [
        {
          label: "设为推荐",
          value: 0
        },
        {
          label: "取消推荐",
          value: 1
        },
        {
          label: "删除",
          value: 2
        }
      ],
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
    handleRecommendStatusStatusChange(index, row) {
      this.updateRecommendStatusStatus(row.id, row.recommendStatus);
    },
    handleDelete(index, row) {
      this.$router.push({ path: "/sms/selectAdd", query: { id: row.id } });
    },
    handleBatchOperate() {
      if (this.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
          duration: 1000
        });
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      if (this.operateType === 0) {
        //设为推荐
        this.updateRecommendStatusStatus(ids, 1);
      } else if (this.operateType === 1) {
        //取消推荐
        this.updateRecommendStatusStatus(ids, 0);
      } else if (this.operateType === 2) {
        //删除
        this.deleteProduct(ids);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
      }
    },
    handleSelectProduct() {
      this.isAddDialog = true;
      this.addOptions = Object.assign({}, defaultAddOptions);
    },
    handleAddTag() {
      this.isAddDialog = false;
      createTag(this.addOptions).then(response => {
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
    handleSelectDialogConfirm() {
      if (this.dialogData.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
          duration: 1000
        });
        return;
      }
      let selectProducts = [];
      for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
        selectProducts.push({
          productId: this.dialogData.multipleSelection[i].id,
          productName: this.dialogData.multipleSelection[i].name
        });
      }
      this.$confirm("使用要进行添加操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        createHotProduct(selectProducts).then(response => {
          this.selectDialogVisible = false;
          this.dialogData.multipleSelection = [];
          this.getList();
          this.$message({
            type: "success",
            message: "添加成功!"
          });
        });
      });
    },
    handleEdit(index, row) {
      this.isEditDialog = true;
      this.addOptions = Object.assign({}, row);
    },
    updateAddTag() {
      this.isEditDialog = false;
      updateTag(this.addOptions, this.addOptions.id).then(response => {
        this.getList();
      });
    },
    handleUpdateSort() {
      this.$confirm("是否要修改排序?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        updateHotProductSort(this.sortDialogData).then(response => {
          this.sortDialogVisible = false;
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    updateRecommendStatusStatus(ids, status) {
      this.$confirm("是否要修改推荐状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          params.append("recommendStatus", status);
          updateRecommendStatus(params).then(response => {
            this.getList();
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "已取消操作!"
          });
          this.getList();
        });
    },
    deleteProduct(ids) {
      this.$confirm("是否要删除该推荐?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteHotProduct(params).then(response => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    getDialogList() {
      fetchProductList(this.dialogData.listQuery).then(response => {
        this.dialogData.list = response.data.list;
        this.dialogData.total = response.data.total;
      });
    }
  }
};
</script>
<style></style>
