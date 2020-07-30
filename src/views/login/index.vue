<template>
  <div>
    <div class="background-wrap">
      <div class="swiper" v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" :key="banner" v-for="banner in banners">
            <img :src="banner" />
          </div>
        </div>
      </div>
      <div class="swiper-mask"></div>
      <div class="content">
        <div class="content-left">
          <div>
            <strong>
              <span style="letter-spacing:-1px;">
                <span style="color: rgb(211, 211, 211);">
                  <span style="font-size: 48px;">
                    <span style="font-family: 微軟正黑體;">供应链金融融资实训系统</span>
                  </span>
                </span>
              </span>
            </strong>
          </div>
          <div>
            <span style="font-size:23px;">
              <span style="color: rgb(255, 255, 255);">
                <span style="font-family: courier new;">SUPPLY CHAIN FINANCING TRAINING SYSTEM</span>
              </span>
            </span>
          </div>
          <img
            class="roll-img"
            src="https://ccdn.goodq.top/caches/4ce61cd756c0c3467de0977d6849043b/aHR0cHM6Ly81N2VhMjM2MDM2OWI1LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTYvMTEvOWNmY2M4YWI1NmQ0Nzk2NGI2ZjFlMzFjNWE2ODMwYjMtOTAud2VicA_p_p100_p_3D_p_p100_p_3D.webp"
          />
        </div>
        <el-card class="login-form-layout">
          <el-form
            autocomplete="on"
            :model="loginForm"
            :rules="loginRules"
            ref="loginForm"
            label-position="left"
          >
            <div style="text-align: center">
              <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #303133"></svg-icon>
            </div>
            <h2 class="login-title color-main">用户登录</h2>
            <el-form-item prop="username">
              <el-input
                name="username"
                type="text"
                v-model="loginForm.username"
                autocomplete="on"
                placeholder="请输入用户名"
              >
                <span slot="prefix">
                  <svg-icon icon-class="user" class="color-main"></svg-icon>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                name="password"
                :type="pwdType"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.password"
                autocomplete="on"
                placeholder="请输入密码"
              >
                <span slot="prefix">
                  <svg-icon icon-class="password" class="color-main"></svg-icon>
                </span>
                <span slot="suffix" @click="showPwd">
                  <svg-icon icon-class="eye" class="color-main"></svg-icon>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 60px;text-align: center">
              <el-button
              class="color-main-bg"
                style="width: 45%"
                :loading="loading"
                @click.native.prevent="handleLogin"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { setSupport, getSupport, setCookie, getCookie } from "@/utils/support";
import login_center_bg from "@/assets/images/login_center_bg.png";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("密码不能小于3位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      login_center_bg,
      dialogVisible: false,
      supportDialogVisible: false,
      banners: [
        "https://ccdn.goodq.top/caches/4ce61cd756c0c3467de0977d6849043b/aHR0cHM6Ly81N2VhMjM2MDM2OWI1LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTYvMTEvMGQyZThiYWIzYWE5ZTkxMzQzOWMwNzQzODA5ODk3MDQtOTAud2VicA_p_p100_p_3D_p_p100_p_3D.webp",
        "https://ccdn.goodq.top/caches/4ce61cd756c0c3467de0977d6849043b/aHR0cHM6Ly81N2VhMjM2MDM2OWI1LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTYvMTEvODRiNzE4MzE0NDVlZGVhMjgzMzk0ZDBiODYyN2UyZjEtOTAud2VicA_p_p100_p_3D_p_p100_p_3D.webp",
        "https://ccdn.goodq.top/caches/4ce61cd756c0c3467de0977d6849043b/aHR0cHM6Ly81N2VhMjM2MDM2OWI1LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTYvMTAvYzkzYzNhY2Y0NTMzOWE4M2Q1NGI3ZjE2NTc2OGJhOTQtOTAud2VicA_p_p100_p_3D_p_p100_p_3D.webp"
      ],
      swiperOption: {
        loop: true,
        autoplay: true,
        effect: "fade",
        fadeEffect: {
          crossFade: true
        },
        speed: 3000
      }
    };
  },
  created() {
    this.loginForm.username = getCookie("username");
    this.loginForm.password = getCookie("password");
    if (
      this.loginForm.username === undefined ||
      this.loginForm.username == null ||
      this.loginForm.username === ""
    ) {
      this.loginForm.username = "admin";
    }
    if (
      this.loginForm.password === undefined ||
      this.loginForm.password == null
    ) {
      this.loginForm.password = "";
    }
  },
  mounted() {
    // this.mySwiper.slideTo(2, 1000, false);
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // let isSupport = getSupport();
          // if(isSupport===undefined||isSupport==null){
          //   this.dialogVisible =true;
          //   return;
          // }
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              setCookie("username", this.loginForm.username, 15);
              setCookie("password", this.loginForm.password, 15);
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("参数验证不合法！");
          return false;
        }
      });
    },
    handleTry() {
      this.dialogVisible = true;
    },
    dialogConfirm() {
      this.dialogVisible = false;
      setSupport(true);
    },
    dialogCancel() {
      this.dialogVisible = false;
      setSupport(false);
    }
  }
};
</script>

<style scoped>
.page{
  overflow: hidden;
}
.swiper {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
.swiper-mask {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: rgba(51, 60, 63, 0.7);
}
.swiper-slide {
  width: 100%;
  overflow: hidden;
}
.swiper-slide img {
  width: 100%;
  height: 100%;
}
.content {
  position: absolute;
  display: flex;
  justify-content: space-around;
  top: 200px;
  width: 100%;
  z-index: 3;
}
.content-left {
  width: 550px;
}
.roll-img {
  width: 400px;
  display: block;
  margin: 40px auto;
  animation: fill-animal-1 20s linear infinite;
}
@-webkit-keyframes fill-animal-1 {
  0% {
    -webkit-transform: rotate(0deg) scale(1);
    transform: rotate(0deg) scale(1);
  }

  30% {
    -webkit-transform: rotate(-180deg) scale(1.15);
    transform: rotate(-180deg) scale(1.15);
  }

  50% {
    -webkit-transform: rotate(0) scale(1.2);
    transform: rotate(0) scale(1.2);
  }

  70% {
    -webkit-transform: rotate(180deg) scale(1.1);
    transform: rotate(180deg) scale(1.1);
  }

  100% {
    -webkit-transform: rotate(0) scale(1);
    transform: rotate(0) scale(1);
  }
}
.backround-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.login-form-layout {
  width: 360px;
  height: 400px;
  border-top: 10px solid rgba(51, 60, 63, 0.7);
  z-index: 99;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: rgba(51, 60, 63, 0.7);
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>
