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
          <el-form-item label="活动名称：">
            <el-input v-model="listQuery.activityNameSearch" class="input-width" placeholder="活动名称"></el-input>
          </el-form-item>
          <el-form-item label="位置：">
            <el-select
              v-model="listQuery.activityKey"
              placeholder="全部"
              clearable
              class="input-width"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="couponTable"
        :data="list"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="活动名称" width="100" align="center">
          <template slot-scope="scope">{{scope.row.activityName}}</template>
        </el-table-column>
        <el-table-column label="位置" align="center">
          <template slot-scope="scope">{{scope.row.activityKey}}</template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">{{scope.row.startTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">{{scope.row.endTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.status === 0 ? '未发布':'已发布'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-show="scope.row.status === 0"
              type="text"
              @click="handleRelease(scope.$index, scope.row)"
            >发布</el-button>
            <el-button
              size="mini"
              v-show="scope.row.status === 0"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              v-show="scope.row.status === 0"
              type="text"
              @click="handleUpdateItem(scope.$index, scope.row)"
            >编辑活动奖项</el-button>
            <el-button
              size="mini"
              v-show="scope.row.status === 1"
              type="text"
              @click="handleOffShelves(scope.$index, scope.row)"
            >下线</el-button>
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
    <el-dialog title="添加活动" :visible.sync="createOptions.showDilog" width="30%">
      <el-form :inline="true" :model="createOptions" size="small" label-width="140px">
        <el-form-item label="活动名称: ">
          <el-input placeholder="请输入活动名称" v-model="createOptions.activityName"></el-input>
        </el-form-item>
        <el-form-item label="位置：">
          <el-select
            v-model="createOptions.activityKey"
            placeholder="全部"
            clearable
            class="input-width"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker
            class="input-width"
            v-model="createOptions.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            class="input-width"
            v-model="createOptions.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="createOptions.status" placeholder="全部" clearable class="input-width">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createOptions.showDilog = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑活动" :visible.sync="updateDilog" width="30%">
      <el-form :inline="true" :model="updateOptions" size="small" label-width="140px">
        <el-form-item label="活动名称: ">
          <el-input placeholder="请输入活动名称" v-model="updateOptions.activityName"></el-input>
        </el-form-item>
        <el-form-item label="位置：">
          <el-select
            v-model="updateOptions.activityKey"
            placeholder="全部"
            clearable
            class="input-width"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker
            class="input-width"
            v-model="updateOptions.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            class="input-width"
            v-model="updateOptions.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="updateOptions.status" placeholder="全部" clearable class="input-width">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDilog.showDilog = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdatefirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="发布" :visible.sync="releaseDilog" width="30%">
      <span style="vertical-align: top">确认发布？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="releaseDilog = false">取 消</el-button>
        <el-button type="primary" @click="lotteryRelease">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="下线" :visible.sync="offShelvesDilog" width="30%">
      <span style="vertical-align: top">确认下线？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="offShelvesDilog = false">取 消</el-button>
        <el-button type="primary" @click="lotteryOffShelves">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  lotteryDict,
  lotteryCreate,
  lotteryOffShelves,
  lotteryRelease,
  lotteryUpdate
} from "@/api/lottery";
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  type: null
};
const defaultTypeOptions = [
  {
    label: "全场赠券",
    value: 0
  }
];
const defaultCreateOptions = {
  showDilog: false,
  activityDesc: "",
  activityKey: "",
  activityName: "",
  endTime: null,
  startTime: null,
  status: 0,
  type: 0
};
export default {
  name: "couponList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      typeOptions: Object.assign({}, defaultTypeOptions),
      createOptions: Object.assign({}, defaultCreateOptions),
      updateOptions: Object.assign({}, defaultCreateOptions),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      releaseDilog: false,
      offShelvesDilog: false,
      updateDilog: false,
      statusOptions: [
        {
          label: "未发布",
          value: 0
        },
        {
          label: "已发布",
          value: 1
        }
      ],
      row: null
    };
  },
  created() {
    this.getLocationList();
    this.getList();
  },
  filters: {
    formatType(type) {
      for (let i = 0; i < defaultTypeOptions.length; i++) {
        if (type === defaultTypeOptions[i].value) {
          return defaultTypeOptions[i].label;
        }
      }
      return "";
    },
    formatUseType(useType) {
      if (useType === 0) {
        return "全场通用";
      } else if (useType === 1) {
        return "指定分类";
      } else {
        return "指定商品";
      }
    },
    formatPlatform(platform) {
      if (platform === 1) {
        return "移动平台";
      } else if (platform === 2) {
        return "PC平台";
      } else {
        return "全平台";
      }
    },
    formatDate(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd:hh-mm-ss");
    },
    formatStatus(endTime) {
      let now = new Date().getTime();
      let endDate = new Date(endTime);
      if (endDate > now) {
        return "未过期";
      } else {
        return "已过期";
      }
    }
  },
  methods: {
    handleCreateConfirm() {
      console.log(this.createOptions);
      lotteryCreate(this.createOptions).then(response => {
        this.createOptions.showDilog = false;
        this.getList();
      });
    },
    handleUpdatefirm() {
      lotteryUpdate(this.updateOptions).then(response => {
        this.updateDilog = false;
        this.getList();
      });
    },
    handleRelease(index, row) {
      this.row = row;
      this.releaseDilog = true;
    },
    lotteryRelease() {
      lotteryRelease({ id: this.row.id }).then(response => {
        this.releaseDilog = false;
        this.getList();
      });
    },
    lotteryOffShelves() {
      lotteryOffShelves({ id: this.row.id }).then(response => {
        this.offShelvesDilog = false;
        this.getList();
      });
    },
    handleUpdate(index, row) {
      this.updateDilog = true;
      this.updateOptions = row;
    },
    handleUpdateItem(index, row) {
      this.$router.push({ path: "/sms/updateLottery", query: { id: row.id } });
    },
    handleOffShelves(index, row) {
      this.row = row;
      this.offShelvesDilog = true;
    },
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
    handleAdd() {
      this.createOptions.showDilog = true;
    },
    // handleUpdate(index, row) {
    //   this.$router.push({ path: "/sms/updateCoupon", query: { id: row.id } });
    // },
    handleDelete(index, row) {
      this.$confirm("是否进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCoupon(row.id).then(response => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getList();
        });
      });
    },
    getLocationList() {
      lotteryDict({}).then(response => {
        this.typeOptions = response.data.activityKey.map(item => {
          return {
            label: item.value,
            value: item.key
          };
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
    }
  }
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>


