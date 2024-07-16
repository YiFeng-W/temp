<template>
  <page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
  <view class="pad padbg">
    <view class="box">
      <view class="row">
        <view>上传身份证照片</view>
        <view class="flex-row justify-between idCard">
          <SmtUpload
            :fileList="opposite.fileList"
            @newFileList="newOpposite"
            :maxCount="opposite.maxCount"
            :upStyle="idStyle"
            :uploadUrl="packApiUrl(IDCardUrl + 1)"
            :custom="true"
          >
            <image
              src="@/pagesMy/static/cardb.png"
              mode="scaleToFill"
              :style="idStyle"
            />
          </SmtUpload>
          <SmtUpload
            :fileList="front.fileList"
            @newFileList="newFront"
            :maxCount="front.maxCount"
            :upStyle="idStyle"
            :uploadUrl="packApiUrl(IDCardUrl + 2)"
            :custom="true"
          >
            <image
              src="@/pagesMy/static/carda.png"
              mode="scaleToFill"
              :style="idStyle"
            />
          </SmtUpload>
        </view>
      </view>
      <view class="flex-row items-center row">
        <view class="tita">姓名</view>
        <view class="contenta">
          <textarea
            v-model="personal.name"
            placeholder="请输入姓名"
            placeholder-class="tp"
            auto-height
          />
        </view>
      </view>
      <view class="flex-row items-center row">
        <view class="tita">性别</view>
        <view class="contenta">
          <up-radio-group
            v-model="personal.sex"
            placement="row"
            @change="sexChange"
          >
            <up-radio label="男" name="男" labelSize="16rem"></up-radio>
            &emsp;
            <up-radio
              label="女"
              name="女"
              labelSize="16rem"
              style="margin-left: 50rpx"
            ></up-radio>
          </up-radio-group>
        </view>
      </view>
      <view class="flex-row items-center row">
        <view class="tita">民族</view>
        <view class="contenta">
          <textarea
            v-model="personal.ethnicity"
            placeholder="请输入民族"
            placeholder-class="tp"
            auto-height
          />
        </view>
      </view>
      <view class="flex-row items-center row">
        <view class="tita">出生日期</view>
        <!-- <view class="contenta">
					<textarea v-model="personal.birthday" placeholder="请输入出生日期" @click="showDate = true"  placeholder-class="tp" auto-height/>
				</view> -->
        <view class="contenta" @click="showDate = true">
          <view class="rili" v-if="!personal.birthday">
            <image src="@/pagesMy/static/rili.png" mode="scaleToFill" />
            <view>请选择出生日期</view>
          </view>
          <view class="riliBirth" v-else>
            {{ personal.birthday }}
          </view>
        </view>
        <up-datetime-picker
          hasInput
          :show="showDate"
          v-model="dateOfBirth"
          mode="date"
          :minDate="-946800000000"
          :maxDate="newDate"
          @cancel="cancelDate"
          @confirm="confirmBirthday"
          format="YYYY年MM月DD日"
        ></up-datetime-picker>
      </view>
      <view class="flex-row items-center row">
        <view class="tita">住址</view>
        <view class="contenta">
          <textarea
            v-model="personal.address"
            placeholder="请输入住址"
            placeholder-class="tp"
            auto-height
          />
        </view>
      </view>
      <view class="flex-row items-center row">
        <view class="tita">身份证号</view>
        <view class="contenta">
          <textarea
            v-model="personal.idcardNumber"
            placeholder="请输入身份证号"
            placeholder-class="tp"
            auto-height
          />
        </view>
      </view>
      <view class="flex-row items-center row">
        <view class="tita">签发机关</view>
        <view class="contenta">
          <textarea
            v-model="personal.issueAuthority"
            placeholder="请输入签发机关"
            placeholder-class="tp"
            auto-height
          />
        </view>
      </view>
      <view class="flex-row items-center row" style="border:none">
        <view class="tita">有效期</view>
        <view class="contenta">
          <textarea
            v-model="personal.validPeriod"
            placeholder="请输入有效期"
            placeholder-class="tp"
            auto-height
          />
        </view>
      </view>
    </view>
    <view
      class="justify-center items-center btn"
      :class="forbidden ? 'forbidden' : ''"
      @click="complete"
      >完成</view
    >
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getUserInfo, getAuthInfo, getFontSize } from "@/utils/local-storage";
import SmtUpload from "@/components/smt-upload/index.vue";
import dayjs from "dayjs";
import { addAuthIndividual, addAuthCompany } from "@/api/pagesMy/userInfo";
import { packApiUrl } from "@/config";

// 根字体大小
const baseFontSize = ref<number>(1);
// 获取用户信息
const userInfo = getUserInfo();

// 用户证明信息
const authInfo = getAuthInfo();

// 用户类型
const type = ref<string>("");

// 绑定个人表单
const personal = ref<any>({
  address: "",
  birthday: "",
  ethnicity: "",
  idcardBackPath: "",
  idcardFrontPath: "",
  idcardNumber: "",
  issueAuthority: "",
  name: "",
  sex: "",
  userId: userInfo.id,
  validPeriod: "",
});

// 判断是否为空
const have = (e: any) => {
  return e !== null && e !== undefined && e !== "";
};

// 上传按钮宽高
const idStyle = ref({
  width: "320rpx",
  height: "220rpx",
});

// 时间戳转换
const timeStamp = (e: number | string) => {
  let date = new Date(e);
  let formattedDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    "-" +
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
  return formattedDate;
};

// 性别选择
const sexChange = (e: any) => {
  console.log(1, personal.value.sex);
};

// 年月日转时间戳
const getTimeStamp = (e: any) => {
  if (e !== null && e !== undefined && e !== "") {
    const year = e.split("年")[0];
    const month = e.split("年")[1].split("月")[0];
    const day = e.split("年")[1].split("月")[1].split("日")[0];
    const dateStr = year + "-" + month + "-" + day;
    return new Date(dateStr).getTime();
  }
};

// 选择时间
const showDate = ref<boolean>(false);
const showRegistration = ref<boolean>(false);
const showOfIncorporation = ref<boolean>(false);
const newDate = ref(Date.now());
const dateOfBirth = ref<any>(Date.now());
const cancelDate = () => {
  showDate.value = false;
  showRegistration.value = false;
  showOfIncorporation.value = false;
};
// 确认选择出生日期
const confirmBirthday = (e: any) => {
  personal.value.birthday = dayjs(timeStamp(e.value)).format("YYYY年MM月DD日");
  showDate.value = false;
};

// 上传身份证
// 识别身份证
const IDCardUrl = "/user/recognize/v1/recognizeIdCard?classify=";

// 正面
const front = ref<{
  fileList: Array<{ url: string }>;
  maxCount: number;
}>({
  fileList: [],
  maxCount: 1,
});
// 反面
const opposite = ref<{
  fileList: Array<{ url: string }>;
  maxCount: number;
}>({
  fileList: [],
  maxCount: 1,
});
// 赋值正面
const newFront = (e: any, z: any) => {
  e.forEach((c: any) => {
    c.url = c.url.idcardFrontPath;
  });
  front.value.fileList = e;
  personal.value.idcardFrontPath = e[0].url;
  personal.value.issueAuthority = z[0].issueAuthority;
  personal.value.validPeriod = z[0].validPeriod;
};
// 赋值反面
const newOpposite = (e: any, z: any) => {
  e.forEach((c: any) => {
    c.url = c.url.idcardBackPath;
  });
  opposite.value.fileList = e;
  personal.value.idcardBackPath = e[0].url;
  personal.value.name = z[0].name;
  personal.value.sex = z[0].sex;
  personal.value.ethnicity = z[0].ethnicity;
  personal.value.birthday = z[0].birthDate;
  personal.value.address = z[0].address;
  personal.value.idcardNumber = z[0].idNumber;
  dateOfBirth.value = getTimeStamp(z[0].birthDate);
};

// 添加个人信息认证
const addPersonal = async () => {
  try {
    const res: any = await addAuthIndividual(personal.value);
    if (res.success) {
      uni.hideLoading();
      uni.$u.toast("添加个人信息认证成功");
      forbidden.value = false;
      uni.navigateBack({
        delta: 1,
      });
    } else {
      uni.hideLoading();
      uni.$u.toast(res.msg);
      forbidden.value = false;
    }
  } catch (e) {
    uni.hideLoading();
    forbidden.value = false;
  }
};

// 提交时禁用按钮？
const forbidden = ref<boolean>(false);
// 点击完成
const complete = () => {
  uni.showLoading({
    title: "订单提交中",
    mask: true,
  });
  forbidden.value = true;
  addPersonal();
};

onLoad(() => {});
onShow(() => {
  baseFontSize.value = getFontSize();
});
</script>

<style lang="scss" scoped>
.pad {
  padding: 24rpx;

  .box {
    background-color: #fff;
    padding: 10rpx 24rpx;
    border-radius: $radius1;

    .row {
      padding: 34rpx 0;
      border-bottom: 2rpx solid $sbgcolor7;
      font-weight: 500;
      font-size: $text4;
      color: #000000;

      .tita {
        width: 160rpx;
      }

      .titb {
        width: 300rpx;
      }

      .idCard {
        margin: 24rpx 0rpx 0rpx 0rpx;
      }

      .contenta {
        width: 490rpx;

        textarea {
          font-size: $text4;
          font-weight: normal;
          width: 490rpx;
          text-align: end;
        }
        .rili {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: $text2;
          font-weight: normal;
          width: 490rpx;
          color: #818385;
          image {
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
          }
        }
        .riliBirth {
          font-size: $text4;
          font-weight: normal;
          text-align: end;
        }

        input {
          text-align: end;
        }

        :deep(.tp) {
          // font-size: 38.4rpx;
          font-size: $text2;
          font-weight: normal;
        }

        :deep(.u-radio-group) {
          justify-content: flex-end;
        }
      }

      .contentb {
        width: 354rpx;
      }
    }
  }

  .btn {
    height: 80rpx;
    background-color: $sbgcolor1;
    border-radius: $radius2;
    margin: 60rpx 0 96rpx 0;
    font-weight: 500;
    font-size: $title1;
    color: #ffffff;
  }

  .choice {
    background-color: #fff;
    padding: 24rpx;
    border-radius: $radius1;
    width: calc(100vw - 192rpx);

    .btn {
      width: 260rpx;
    }
  }
}
</style>