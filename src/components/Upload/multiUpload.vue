<template>
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :data="useOss?dataObj:null"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
      :multiple="multiple"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { policy } from "@/api/oss";

export default {
  name: "multiUpload",
  props: {
    //图片属性数组
    value: Array,
    //最大上传图片数量
    maxCount: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: ""
      },
      multiple: true,
      dialogVisible: false,
      dialogImageUrl: null,
      useOss: true, //使用oss->true;使用MinIO->false
      ossUploadUrl: "/apiUpload",
      minioUploadUrl: "http://localhost:8080/minio/upload",
      imgId: 0,
      imgList: []
    };
  },
  created() {
    this.nums = 0;
  },
  computed: {
    fileList() {
      let fileList = [];
      for (let i = 0; i < this.value.length; i++) {
        fileList.push({ url: this.value[i] });
      }
      return fileList;
    }
  },
  methods: {
    emitInput(fileList) {
      let value = [];
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url);
      }
      this.$emit("input", value);
    },
    handleRemove(file, fileList) {
      this.emitInput(fileList);
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    async beforeUpload(file) {
      this.isUpload = true;
      // console.log(file);
      let _self = this;
      if (!this.useOss) {
        //不使用oss不需要获取策略
        return true;
      }
      this.nums++;
      var len = 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var key = "";
      for (var i = 0; i < len; i++) {
        key += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      this.key = key;

      try {
        let response = await policy();
        _self.dataObj.policy = response.data.policy;
        _self.dataObj.signature = response.data.signature;
        _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
        _self.dataObj.key = response.data.key;
        _self.dataObj.dir = response.data.key.slice(0, 21);
        _self.dataObj.host = response.data.host;
        this.imgList.push({
          uid: file.uid,
          key: response.data.key
        });
        this.nums--;
        return true;
      } catch  (err) {
        this.nums--;
        return false;
      }
      // return new Promise((resolve, reject) => {
      //   console.log('----ttt', file.uid);
      //   policy()
      //     .then(response => {
      //       console.log('-----ccc', file.uid);
      //       _self.dataObj.policy = response.data.policy;
      //       _self.dataObj.signature = response.data.signature;
      //       _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
      //       _self.dataObj.key = response.data.key;
      //       _self.dataObj.dir = response.data.key.slice(0, 21);
      //       _self.dataObj.host = response.data.host;
      //       console.log('----dddd', response.data.key);
      //       this.imgList.push({
      //         uid: file.uid,
      //         key: response.data.key
      //       });
      //       resolve(true);
      //     })
      //     .catch(err => {
      //       console.log('----err',err);
      //       reject(false);
      //     });
      // });
    },
    handleUploadSuccess(res, file, fileList) {
      if(!this.isUpload) return;
      this.isUpload = false;
      setTimeout(() => {
        if (this.nums > 0) {
          this.timer = setInterval(() => {
            if(this.nums === 0) {
              clearInterval(this.timer);
              this.uploadSuccess(res, file, fileList);
            }
          }, 1000);
        } else {
          this.uploadSuccess(res, file, fileList)
        }
      }, 1000);

      // let url = this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name;
      // if (!this.useOss) {
      //   //不使用oss直接获取图片路径
      //   url = res.data.url;
      // }
      // this.fileList.push({ name: file.name, url: url });
      // this.emitInput(this.fileList);
    },
    uploadSuccess(res, file, fileList) {
      let files = [];
      fileList.forEach(file => {
        let url = file.url;
        if (file.name) {
          this.imgList.forEach(item => {
            if (item.uid === file.uid) {
              url = this.dataObj.host + "/" + item.key;
            }
          });
          if (!this.useOss) {
            //不使用oss直接获取图片路径
            url = res.data.url;
          }
          files.push({ name: file.name, url: url });
        }
      });
      this.fileList.push(...files);
      this.emitInput(this.fileList);
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "最多只能上传" + this.maxCount + "张图片",
        type: "warning",
        duration: 1000
      });
    }
  }
};
</script>
<style>
</style>


