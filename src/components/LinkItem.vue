<template>
  <div
    class="linkItem"
    :style="{
      backgroundImage:
        linkItem.linkThumbnail != '' ? `url('${linkItem.linkThumbnail}')` : '',
    }"
  >
    <div style="display: flex; padding: 12px">
      <div style="flex: 1"></div>
      <div class="bookmark" @click.stop>
        <input
          type="checkbox"
          :id="`bookmark${linkItem.linkId}`"
          @change="onChangeBookmark"
          :checked="linkItem.linkIsMarked"
          v-model="isBookmark"
        />
        <label :for="`bookmark${linkItem.linkId}`"></label>
      </div>
    </div>
    <div class="flex1"></div>
    <div class="linkContent">
      <div class="categoryName">{{ linkItem.categoryName }}</div>
      <div class="regDt">
        {{ getDay(linkItem.linkTimeStamp) }} <span>{{ $t("register") }}</span>
      </div>
      <div class="title">{{ linkItem.linkTitle }}</div>
      <div class="linkBottom">
        <div class="linkUrl">{{ getUrlParse(linkItem.linkUrl) }}</div>
        <img
          src="../../public/images/more_icon.png"
          @click.stop="onClickMoreIcon"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LinkItem",
  props: {
    linkItem: {
      type: Object,
      default: () => {
        return {
          linkId: 0,
          linkThumbnail: "",
          categoryId: "",
          categoryName: "",
          linkTitle: "",
          linkTimeStamp: "",
          linkUrl: "",
          linkIsMarked: false,
        };
      },
    },
  },
  data() {
    return {
      isBookmark: this.linkItem.linkIsMarked,
      backgroundImageUrl: `url${require("../../public/images/thumbnail_basic.png")}`,
    };
  },
  methods: {
    getDay(timeStamp) {
      const returnDate = new Date(timeStamp);
      const year = returnDate.getFullYear();
      const month = returnDate.getMonth() + 1;
      const day = returnDate.getDate();

      return `${year}-${("00" + month).slice(-2)}-${("00" + day).slice(-2)}`;
    },
    getUrlParse(linkUrl) {
      const returnUrl = new URL(linkUrl);
      return returnUrl.host;
    },
    onChangeBookmark() {
      this.$emit(
        "isBookmark",
        this.linkItem.categoryId,
        this.linkItem.linkTimeStamp,
        this.isBookmark
      );
    },
    onClickMoreIcon() {
      this.$emit(
        "onClickLinkItem",
        this.linkItem.categoryId,
        this.linkItem.linkTimeStamp
      );
    },
  },
};
//3569
</script>
<style scoped>
.linkItem {
  width: 233px;
  height: 292px;
  border-radius: 8px;
  background-image: url("../../public/images/thumbnail_basic.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .linkItem {
    width: 158px;
    height: 240px;
  }
}
.bookmark {
  width: 36px;
  height: 36px;
  background-color: #ffffffc2;
  border-radius: 5px;
  cursor: pointer;
}
.linkContent {
  background-color: #ffffffd6;
  padding: 12px;
  border-radius: 8px;
}
.linkContent .categoryName {
  display: inline-block;
  background-color: var(--gray600);
  border-radius: 2px;
  color: var(--gray100);
  font-size: 10px;
  padding: 2px 4px;
}
.linkContent .regDt {
  color: var(--gray600);
  font-size: 9px;
  margin-top: 4px;
}
.linkContent .title {
  color: var(--gray700);
  font-size: 16px;
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media screen and (max-width: 768px) {
  .linkContent .title {
    font-size: 14px;
  }
}
.linkContent .linkBottom {
  display: flex;
  margin-top: 30px;
  justify-content: space-between;
  align-items: flex-end;
}
.linkContent .linkBottom img {
  width: 24px;
  cursor: pointer;
}
.linkContent .linkBottom .linkUrl {
  color: var(--gray300);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}
input[type="checkbox"] {
  display: none;
}
input[type="checkbox"] + label {
  background: url(../../public/images/bookmark_off.png) no-repeat;
  background-size: cover;
  width: 28px;
  height: 28px;
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
  margin: 4px;
}
input[type="checkbox"]:checked + label {
  background: url(../../public/images/bookmark_on.png) no-repeat;
  background-size: cover;
}
</style>
