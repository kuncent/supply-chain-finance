<template>
  <div class="app-container">
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
        <el-table-column label="奖品名称" width="100" align="center">
          <template slot-scope="scope">{{scope.row.itemName}}</template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">{{type_Obj[scope.row.type]}}</template>
        </el-table-column>
        <el-table-column label="图片" width="120" align="center">
          <template slot-scope="scope">
            <img style="height: 80px" :src="scope.row.imgUrl" />
          </template>
        </el-table-column>
        <el-table-column label="积分数量" align="center">
          <template slot-scope="scope">{{scope.row.points }}</template>
        </el-table-column>
        <el-table-column label="优惠券" align="center">
          <template slot-scope="scope">优惠券{{scope.row.couponId}}</template>
        </el-table-column>
        <el-table-column label="奖品数量" align="center">
          <template slot-scope="scope">{{scope.row.awardTotal === -1 ? '不限量' : scope.row.awardTotal}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="text" @click="handleOffShelves(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="添加奖项" :visible.sync="createOptions.showDilog" width="30%">
      <el-form :inline="true" :model="createOptions" size="small" label-width="140px">
        <el-form-item label="奖品名称: ">
          <el-input placeholder v-model="createOptions.itemName"></el-input>
        </el-form-item>
        <el-form-item label="概率(%): ">
          <el-input placeholder v-model="createOptions.luckRatio">%</el-input>
        </el-form-item>
        <el-form-item label="图片: ">
          <single-upload
            v-model="createOptions.imgUrl"
            style="width: 300px;display: inline-block;margin-left: 10px"
          ></single-upload>
        </el-form-item>
        <el-form-item label="奖品数量: ">
          <el-input placeholder v-model="createOptions.awardTotal"></el-input>
        </el-form-item>
        <el-form-item label="奖品类型：">
          <el-radio v-model="createOptions.type" label="0">优惠券</el-radio>
          <br />
          <el-radio v-model="createOptions.type" label="1">积分</el-radio>
          <br />
          <el-radio v-model="createOptions.type" label="2">赠品</el-radio>
        </el-form-item>
        <el-form-item label="优惠券" v-if="createOptions.type==0">
          <el-select v-model="createOptions.couponId" placeholder="请选择">
            <el-option
              v-for="item in couponList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createOptions.showDilog = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改奖项" :visible.sync="updateDilog" width="30%">
      <el-form :inline="true" :model="updateOptions" size="small" label-width="140px">
        <el-form-item label="奖品名称: ">
          <el-input placeholder v-model="updateOptions.itemName"></el-input>
        </el-form-item>
        <el-form-item label="概率(%): ">
          <el-input placeholder v-model="updateOptions.luckRatio"></el-input>
        </el-form-item>
        <el-form-item label="图片: ">
          <single-upload
            v-model="updateOptions.imgUrl"
            style="width: 300px;display: inline-block;margin-left: 10px"
          ></single-upload>
        </el-form-item>
        <el-form-item label="奖品数量: ">
          <el-input placeholder v-model="updateOptions.awardTotal"></el-input>
        </el-form-item>
        <el-form-item label="奖品类型：">
          <el-radio v-model="updateOptions.type" label="0">优惠券</el-radio>
          <br />
          <el-radio v-model="updateOptions.type" label="1">积分</el-radio>
          <br />
          <el-radio v-model="updateOptions.type" label="2">赠品</el-radio>
        </el-form-item>
        <el-form-item label="优惠券" v-if="updateOptions.type==0">
          <el-select v-model="updateOptions.couponId" placeholder="请选择">
            <el-option
              v-for="item in couponList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDilog = false">取 消</el-button>
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
      <span style="vertical-align: top">确认删除？</span>
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
  lotteryListItem,
  lotteryCreateItem,
  lotteryUpdateItem,
  lotteryDeleteItem
} from "@/api/lottery";
import {fetchList as getCouponList} from "@/api/coupon";
import { formatDate } from "@/utils/date";
import SingleUpload from "@/components/Upload/singleUpload";
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
  awardId: 0,
  awardTotal: 0,
  couponId: null,
  defineId: 0,
  imgUrl: "",
  itemName: "",
  luckRatio: 0,
  points: 0,
  type: '0'
};

export default {
  name: "couponList",
  components: { SingleUpload },
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
      id: null,
      row: null,
      type_Obj: {
        '0': '优惠券',
        '1': '积分',
        '2': '赠品'
      },
      couponList: []
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.createOptions.defineId = this.id;
    this.getList();
    this.getCouponList();
  },
  filters: {
    formatType(type) {

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
      this.createOptions.luckRatio = this.createOptions.luckRatio*100;
      lotteryCreateItem(this.createOptions).then(response => {
        this.createOptions.showDilog = false;
        this.getList();
      });
    },
    handleUpdatefirm() {
      this.updateOptions.luckRatio = this.updateOptions.luckRatio*100;
      lotteryUpdateItem(this.updateOptions).then(response => {
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
      lotteryDeleteItem({ id: this.row.id }).then(response => {
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
      this.createOptions.luckRatio = 0;
      this.createOptions.showDilog = true;
    },
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
    getList() {
      this.listLoading = true;
      lotteryListItem({ defineId: this.id }).then(response => {
        this.listLoading = false;
        this.list = response.data;
        this.list.forEach(element => {
          element.luckRatio = element.luckRatio/100
        });
        this.total = response.data.total;
      });
    },
    getCouponList() {
      const params ={
        pageSize: 1000,
        pageNum: 1
      }
      getCouponList(params)
        .then(({data}) => {
          this.couponList = data.list || [];
        })
        .catch(err => {
        })
    }
  }
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>


