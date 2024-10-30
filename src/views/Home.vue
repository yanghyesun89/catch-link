<template>
  <div class="loadingBg df" v-if="isLoading">
    <Vue3Lottie :animationData="loading" ref="lottie" class="loading" />
  </div>
  <div class="home">
    <!-- 검색 헤더바 -->
    <div class="linkHeader">
      <div class="logo">
        <img src="../../public/images/logo.png" class="logoImg" />
      </div>
      <div class="searchBox">
        <img src="../../public/images/search_icon.png" class="searchIcon" />
        <input
          type="text"
          class="inputBox"
          :placeholder="$i18n.t('link_search')"
          v-model="searchValue"
          @input="changeSearchValue($event)"
        />
      </div>
      <div class="bookmark">
        <input
          type="checkbox"
          v-model="linkParam.isMarked"
          @change="onClickBookmark"
          id="isBookmark"
        />
        <label for="isBookmark"></label>
        <div class="bookmarkCnt" :class="{ on: linkParam.isMarked }">
          {{ $t("bookmark") }}
          <span>{{ bookmarkCnt }}</span>
        </div>
      </div>
      <div class="setting" @click="onClickSettingModal">
        <img src="../../public/images/setting_icon.png" class="settingIcon" />
      </div>
    </div>
    <!-- 카테고리 편집 -->
    <div class="tabList">
      <div class="tabInnerList flex1">
        <TabItem
          :tabItem="totalCategory"
          @categoryId="onClickTab"
          :class="{ on: selectCategory === totalCategory.categoryId }"
        ></TabItem>
        <TabItem
          v-for="(item, idx) in categoryList"
          :key="idx"
          :tabItem="item"
          @categoryId="onClickTab"
          :class="{ on: selectCategory === item.categoryId }"
        ></TabItem>
      </div>
      <div class="categoryEdit" @click="onClickEditCategoryBtn">
        {{ $t("edit") }}
      </div>
    </div>
    <div class="linkContent">
      <!-- 링크 목록 -->
      <div
        class="blank df"
        v-if="linkList.length === 0 && searchValue.trim() === ''"
      >
        <div class="">
          <div class="blankTitle">
            <div>{{ $t("link_empty1") }}</div>
            <div>{{ $t("link_empty2") }}</div>
          </div>
          <div class="mt6">
            <img
              src="../../public/images/img_cat_sleep.png"
              class="linkEmptyImg"
            />
          </div>
          <div class="blankMiddle mt20">
            <div>{{ $t("link_empty3") }}</div>
            <div>{{ $t("link_empty4") }}</div>
          </div>
          <div class="blankEnd mt8">
            {{ $t("link_empty5") }}
            <span class="point">{{ $t("link_empty6") }}</span>
          </div>
        </div>
      </div>
      <div
        class="blank df"
        v-else-if="searchList.length === 0 && searchValue.trim() !== ''"
      >
        <div class="">
          <div class="blankTitle">
            <img
              src="../../public/images/search_empty.png"
              class="searchEmptyImg"
            />
            <div>{{ $t("search_no_link") }}</div>
          </div>
        </div>
      </div>
      <div class="linkList" v-else>
        <LinkItem
          v-for="(item, idx) in searchList"
          :key="idx"
          :linkItem="item"
          @onClickLinkItem="onClickLinkItem"
          @isBookmark="isBookmark"
        ></LinkItem>
      </div>
    </div>
    <div class="addBtn" @click="onClickAddLink">
      <img src="../../public/images/plus_add_icon.png" class="plusIcon" />
    </div>
    <div class="snackBar" v-if="isShowSnackBar">
      <img src="../../public/images/ic_check_success.png" class="checkIcon" />
      <p class="content">{{ snackBarContent }}</p>
    </div>
  </div>
  <ContentModal v-if="isShowModalLinkDetail" :height="`473px`">
    <template v-slot:header>
      <div class="contentHeader">
        <div class="leftHeader" @click="onClickLinkEditModal">
          {{ $t("edit") }}
        </div>
        <div class="title">{{ $t("more") }}</div>
        <div @click="onClickLinkDetailModalClose()">
          <img src="../../public/images/close_icon.png" class="closeIcon" />
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="modal linkDetailContent">
        <div class="title">
          <div class="flex1 contentTitle">{{ linkDetail.linkTitle }}</div>
          <div>
            <img
              src="../../public/images/ic_copy_link.png"
              class="copyIcon"
              @click="copyLink(linkDetail.linkUrl)"
            />
          </div>
        </div>
        <div class="linkDetailThumbnail" @click="moveLink(linkDetail.linkUrl)">
          <div class="explain flex1">
            <div class="linkThumbnailTitle" v-if="linkDetail.linkTitle">
              {{ linkDetail.linkTitle }}
            </div>
            <div class="linkThumbnailTitle" v-else>
              {{ linkDetail.linkUrl }}
            </div>
            <div class="linkUrl">{{ linkDetail.linkHost }}</div>
          </div>
          <img
            src="../../public/images/thumbnail_basic.png"
            class="thumbnailImg"
            v-if="linkDetail.linkThumbnail === ''"
          />
          <img :src="linkDetail.linkThumbnail" class="thumbnailImg" v-else />
        </div>
        <div class="memo">
          <div class="memoLabel">
            <img src="../../public/images/memo_icon.png" class="memoIcon" />
            <!-- 이미지 -->
            {{ $t("note") }}
          </div>
          <div class="memoContent">
            {{ linkDetail.linkMemo }}
          </div>
        </div>
        <div class="modalBtn delete">
          <div class="btnBox delBox">
            <!-- 이미지 -->
            <div @click="onClickDeleteLink">
              <img
                src="../../public/images/delete_icon.png"
                class="deleteIcon"
              />
              <span>{{ $t("delete") }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ContentModal>
  <ContentModal v-if="isShowModalCategoryAdd" :height="`248px`">
    <template v-slot:header>
      <div class="contentHeader">
        <div class="leftHeader"></div>
        <div class="title">{{ $t("category_name_setting") }}</div>
        <div @click="onClickCategoryAddModalClose()">
          <img src="../../public/images/close_icon.png" class="closeIcon" />
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="editCategoryContent">
        <div class="editCategoryNameTitle">{{ $t("nice_name_setting") }}</div>
        <div class="mt8">
          <input
            type="text"
            v-model="categoryAdd"
            :placeholder="$i18n.t('category_name_set')"
          />
        </div>
        <div
          class="grayBtn mt40"
          @click="requestCategoryAdd"
          :class="{ grayBtnOn: categoryAdd.trim().length != 0 }"
        >
          {{ $t("save") }}
        </div>
      </div>
    </template>
  </ContentModal>
  <ContentModal v-if="isShowModalEditCategory">
    <template v-slot:header>
      <div class="contentHeader">
        <div class="leftHeader colorGray400" @click="onClickEditCategoryClose">
          {{ $t("cancel") }}
        </div>
        <div class="title">{{ $t("category_edit") }}</div>
        <div @click="onClickEditCategoryClose" class="complete colorBlue500">
          {{ $t("complete") }}
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="modal categoryEditContent">
        <div class="">
          <div class="categoryTotalCnt">
            {{ $t("in_total") }} {{ categoryList.length }}{{ $t("categories") }}
          </div>
          <div class="myCategoryList">
            <div class="myCategoryItem">
              <div class="categoryNm flex1">
                {{ myCatch.categoryName }}
                <span
                  class="linkCnt"
                  :class="{ linkEmpty: myCatch.categoryLinkCnt === 0 }"
                  >{{ myCatch.categoryLinkCnt }}</span
                >
              </div>
              <div class="editBtn">
                {{ $t("basic") }}
              </div>
              <div class="drag"></div>
            </div>
            <draggable
              :list="categoryEditList"
              group="people"
              item-key="id"
              @change="onChangeCategory"
            >
              <template #item="{ element }">
                <div class="myCategoryItem">
                  <div class="categoryNm flex1">
                    {{ element.categoryName }}
                    <span
                      class="linkCnt"
                      :class="{ linkEmpty: element.categoryLinkCnt === 0 }"
                      >{{ element.categoryLinkCnt }}</span
                    >
                  </div>
                  <div
                    class="editBtn"
                    @click="onClickEditCategoryName(element)"
                  >
                    <img
                      src="../../public/images/edit_icon.png"
                      class="editIcon"
                    />
                    {{ $t("modify") }}
                  </div>
                  <div class="drag">
                    <img
                      src="../../public/images/dragdrop_icon.png"
                      class="dragAndDropIcon"
                    />
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
        <div class="modalBtn add">
          <div class="btnBox addBox">
            <!-- 이미지 -->
            <div @click="onClickAddCategory">
              <img
                src="../../public/images/plus_blue_icon.png"
                class="plusBlueIcon"
              />
              {{ $t("add") }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </ContentModal>
  <ContentModal v-if="isShowModalCategoryNameEdit" :height="`279px`">
    <template v-slot:header>
      <div class="contentHeader">
        <div class="leftHeader"></div>
        <div class="title">{{ $t("category_name_setting") }}</div>
        <div @click="onClickCategoryEditModalClose()">
          <img src="../../public/images/close_icon.png" class="closeIcon" />
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="editCategoryContent">
        <div class="editCategoryNameTitle">{{ $t("nice_name_setting") }}</div>
        <div class="mt8">
          <input
            type="text"
            v-model="categoryEdit.categoryName"
            :placeholder="$i18n.t('category_name_set')"
          />
        </div>
        <div class="categoryDelete" @click="onClickCategoryDelete">
          <img
            src="../../public/images/category_delete_icon.png"
            class="categoryDeleteIcon"
          />
          {{ $t("category_delete") }}
        </div>
        <div
          class="grayBtn mt16"
          @click="requestCategoryEdit"
          :class="{ grayBtnOn: categoryEdit.categoryName.trim().length != 0 }"
        >
          {{ $t("save") }}
        </div>
      </div>
    </template>
  </ContentModal>
  <ContentModal v-if="isShowModalLinkAdd" :height="`640px`">
    <template v-slot:header>
      <div class="contentHeader">
        <div class="leftHeader"></div>
        <div class="linkAddTitle">{{ $t("link_add") }}</div>
        <div @click="onClickAddLinkModalClose">
          <img src="../../public/images/close_icon.png" class="closeIcon" />
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="linkAddContent">
        <div class="subHeader mt16">{{ $t("link_add") }}</div>
        <div class="urlInputBox">
          <input
            type="text"
            class="inputBox"
            :placeholder="$i18n.t('link_input')"
            v-model="reqLinkAdd.url"
            :disabled="isLinkCheck"
            @input="onChangeLinkInputbox"
          />
          <div
            @click="requestPostLinkParse"
            class="checkUrl"
            v-if="!isLinkCheck && !isErrorLink"
          >
            {{ $t("check") }}
          </div>
          <div v-else-if="isLinkCheck && !isErrorLink">
            <img
              src="../../public/images/ic_checked_link.png"
              class="checkIcon"
            />
          </div>
          <div v-if="isErrorLink">
            <img
              src="../../public/images/ic_error_link.png"
              class="checkIcon"
            />
          </div>
        </div>
        <div v-if="isErrorLink" class="errorLink">
          {{ $t("link_error") }}
        </div>
        <div class="linkAddThumbnail" v-if="isLinkCheck">
          <div class="explain flex1">
            <div class="linkThumbnailTitle">{{ linkUrlParse.title }}</div>
            <div class="linkUrl">{{ linkUrlParse.domain }}</div>
          </div>
          <img
            v-if="linkUrlParse.thumbnail.trim() === ''"
            src="../../public/images/thumbnail_basic.png"
            class="thumbnailImg"
          />
          <img v-else :src="linkUrlParse.thumbnail" class="thumbnailImg" />
        </div>
        <div class="subHeader mt30" style="display: flex">
          {{ $t("link_title") }}
        </div>
        <div>
          <input
            type="text"
            class="linkTitle"
            :placeholder="$i18n.t('title_input')"
            v-model="reqLinkAdd.title"
          />
        </div>
        <div class="subHeader mt30 categorySelect">
          <div class="flex1">{{ $t("category_select") }}</div>
          <div class="linkCategoryAdd" @click="onClickCategoryAdd">
            <span style="padding: 1px 0">{{ $t("add") }}</span>
            <img src="../../public/images/ic_category_plus.png" />
          </div>
        </div>
        <div class="categoryList">
          <template v-for="(item, idx) in categoryList" :key="idx">
            <input
              type="radio"
              class="checkItem"
              name="categorySelect"
              v-model="reqLinkAdd.categoryId"
              :value="item.categoryId"
              :id="item.categoryId"
            />
            <label :for="item.categoryId">{{ item.categoryName }}</label>
          </template>
        </div>
        <div class="subHeader mt30">{{ $t("memo") }}</div>
        <textarea
          class="memoContent"
          :placeholder="$i18n.t('memo_input')"
        ></textarea>
      </div>
      <div class="blueBtn" @click="onClickLinkRegister">{{ $t("save") }}</div>
    </template>
  </ContentModal>
  <ContentModal v-if="isShowModalSetting">
    <template v-slot:header>
      <div class="contentHeader">
        <div class="leftHeader"></div>
        <div class="linkAddTitle">MY</div>
        <div @click="onClickSettingClose">
          <img src="../../public/images/close_icon.png" class="closeIcon" />
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="settingContent">
        <div class="mySub1">{{ $t("member") }}</div>
        <div class="myCon1">
          <div class="myEmail flex1">{{ email }}</div>
        </div>
        <div class="myCon3">
          <div class="setList setLang">
            <div class="setListItem flex1">{{ $t("setting_lang") }}</div>
            <div class="setLangItem">
              <select v-model="setLang" @change="onChangeLang">
                <option
                  v-for="(item, idx) in langList"
                  :key="idx"
                  :value="item.locale"
                >
                  {{ item.langName }}
                </option>
              </select>
              <img
                src="../../public/images/ic_arrow_right.png"
                class="arrowIcon"
              />
            </div>
          </div>
          <!-- <div class="setList">
            <div class="setListItem">{{ $t("remove_ad") }}</div>
          </div> -->
          <div class="setList setVersion">
            <div class="setListItem flex1">{{ $t("version_info") }}</div>
            <div class="setLangItem" style="padding-right: 8px">1.0.0</div>
          </div>
          <div class="setList withDraw" @click="requestDeleteUser">
            <div>
              {{ $t("withdraw") }}
            </div>
          </div>
        </div>
      </div>
      <div class="grayLineBtn mt20" @click="onClickLogout">
        {{ $t("logout") }}
      </div>
    </template>
  </ContentModal>
</template>
<script>
import TabItem from "@/components/TabItem.vue";
import LinkItem from "@/components/LinkItem.vue";
import ContentModal from "@/components/ContentModal.vue";
import draggable from "vuedraggable";
import { Vue3Lottie } from "vue3-lottie";
import loading from "@/assets/loading_web.json";

import {
  deleteUser,
  postCategoryAdd,
  deleteCategory,
  getCategoryList,
  patchCategoryEdit,
  patchCategoryOrder,
  getAllLinkList,
  postLinkAdd,
  getLinkDetail,
  patchLinkBookmark,
  deleteLink,
  patchLinkEdit,
  postLinkParse,
} from "@/api/index.js";
import { getLogout } from "@/api/auth.js";

const naverClientId = process.env.VUE_APP_NAVER_LOGIN_CLIENT_ID;
const naverClientSecret = process.env.VUE_APP_NAVER_LOGIN_SECRET_KEY;

export default {
  name: "HomeView",
  components: {
    TabItem,
    LinkItem,
    ContentModal,
    draggable,
    Vue3Lottie,
  },
  data() {
    return {
      loading,
      isLoading: false,
      totalCategory: {
        categoryName: this.$i18n.t("total"),
        categoryId: "",
        categoryLinkCnt: 0,
      },
      selectCategory: "",
      categoryList: [],
      categoryEditList: [],
      myCatch: {
        categoryId: "",
        categoryName: "",
        categoryLinkCnt: 0,
      },
      linkParam: {
        isMarked: false,
        categoryId: "",
      },
      linkList: [],
      bookmarkCnt: 0,
      isShowModalLinkDetail: false,
      isShowModalCategoryAdd: false,
      isShowModalEditCategory: false,
      isShowModalLinkAdd: false,
      isShowModalSetting: false,
      isShowModalCategoryNameEdit: false,
      checkItem: [],
      categoryAdd: "", //추가용 카테고리 이름
      categoryEdit: {
        categoryName: "",
        categoryId: "",
      }, //수정용 카테고리 이름
      //링크 추가 req
      reqLinkAdd: {
        categoryId: "",
        title: "",
        url: "",
        thumbnail: "",
        memo: "",
      },
      linkDetail: {
        categoryId: "",
        categoryName: "",
        linkDomain: "",
        linkId: "",
        linkIsMarked: false,
        linkMemo: "",
        linkThumbnail: "",
        linkTimeStamp: "",
        linkTitle: "",
        linkUrl: "",
        linkHost: "",
      },
      isLinkEdit: false,
      isLinkCheck: false,
      isErrorLink: false,
      linkUrlParse: {
        title: "",
        thumbnail: "",
        domain: "",
      },
      searchValue: "",
      searchList: [],
      isShowSnackBar: false,
      snackBarContent: "카테고리가 추가되었습니다.",
      langList: [
        {
          langName: "한국어",
          locale: "ko",
        },
        {
          langName: "english",
          locale: "en",
        },
      ],
      setLang: "en",
      email: sessionStorage.getItem("email"),
    };
  },
  mounted() {
    this.requesetCategoryList();
    this.requestGetAllLinkList();
    this.setLang = this.$i18n.locale;
  },
  methods: {
    requestDeleteUser() {
      if (confirm(this.$i18n.t("alert_withdraw"))) {
        this.isLoading = true;
        deleteUser()
          .then((result) => {
            const data = result.data;
            const status = result.status;
            if (status === 200) {
              if (data.status === 200) {
                sessionStorage.clear();
                alert(this.$i18n.t("alert_withdraw_success"));
                this.$router.push("/");
              }
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    requesetCategoryList() {
      this.isLoading = true;
      getCategoryList()
        .then((result) => {
          const data = result.data;
          const status = result.status;
          if (status === 200) {
            if (data.status === 200) {
              const dataList = data.data.categoryList;
              this.categoryList = dataList;
              this.totalCategory.categoryLinkCnt = data.data.linkCnt;
              //편집용 카테고리 리스트
              this.categoryEditList = [...dataList];
              //나의 캐치는 default로 빼놓기
              this.myCatch = this.categoryEditList[0];
              this.categoryEditList.splice(0, 1);
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestCategoryAdd() {
      if (this.categoryAdd === "") {
        return;
      }
      let len = 0;
      for (let i = 0; i < this.categoryAdd.length; i++) {
        len += this.categoryAdd.charCodeAt(i) >= 110 ? 2 : 1;
      }
      if (len > 10) {
        alert(this.$i18n.t("name_len_max"));
        return;
      }
      this.isLoading = true;
      postCategoryAdd(this.categoryAdd)
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            if (data.status === 200) {
              this.isShowModalCategoryAdd = false;
              this.requesetCategoryList();

              this.snackBarContent = `'${this.categoryAdd}' ${this.$i18n.t(
                "snackbar_add_category"
              )}`;
              this.isShowSnackBar = true;
              setTimeout(() => {
                this.isShowSnackBar = false;
              }, 2000);
              this.categoryAdd = "";
            }
          } else if (status === 400) {
            alert(this.$i18n.t("alert_exists"));
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestCategoryEdit() {
      if (this.categoryEdit.categoryName === "") {
        return;
      }
      this.isLoading = true;
      patchCategoryEdit(this.categoryEdit)
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            if (data.status === 200) {
              this.isShowModalCategoryNameEdit = false;
              this.snackBarContent = `'${this.categoryAdd}' ${this.$i18n.t(
                "snackbar_update_category"
              )}`;
              this.isShowSnackBar = true;
              setTimeout(() => {
                this.isShowSnackBar = false;
              }, 2000);
              this.requesetCategoryList();
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestDeleteCategory() {
      this.isLoading = true;
      deleteCategory(this.categoryEdit.categoryId)
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            if (data.status === 200) {
              this.isShowModalCategoryNameEdit = false;
              this.snackBarContent = `'${this.categoryAdd}' ${this.$i18n.t(
                "snackbar_delete_category"
              )}`;
              this.isShowSnackBar = true;
              setTimeout(() => {
                this.isShowSnackBar = false;
              }, 2000);
              this.requesetCategoryList();
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestPatchCategoryOrder() {
      const reqList = [];
      this.categoryEditList.forEach((item) => {
        reqList.push(item.categoryId);
      });
      this.isLoading = true;
      patchCategoryOrder(reqList)
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            if (data.status === 200) {
              this.requesetCategoryList();
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestGetAllLinkList() {
      this.isLoading = true;
      getAllLinkList(this.linkParam.isMarked, this.linkParam.categoryId)
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            if (data.status === 200) {
              this.linkList = data.data.linkList;
              this.searchList = this.linkList;
              this.bookmarkCnt = data.data.bookmarkCnt;
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestPostLinkAdd() {
      this.isLoading = true;
      postLinkAdd(this.reqLinkAdd)
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            const code = data.status;
            if (code === 200) {
              this.isShowModalLinkAdd = false;
              this.snackBarContent = `${this.$i18n.t("snackbar_add_link")}`;
              this.isShowSnackBar = true;
              setTimeout(() => {
                this.isShowSnackBar = false;
              }, 2000);
              this.requesetCategoryList();
              this.requestGetAllLinkList();

              this.reqLinkAdd = {
                categoryId: "",
                title: "",
                url: "",
                thumbnail: "",
                memo: "",
              };
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestGetLinkDetail(categoryId, linkTimeStamp) {
      this.isLoading = true;
      getLinkDetail(categoryId, linkTimeStamp)
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            const code = data.status;
            if (code === 200) {
              this.linkDetail = data.data;
              const resultUrl = new URL(this.linkDetail.linkUrl);
              this.linkDetail.linkHost = resultUrl.host;
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestPatchLinkBookmark(categoryId, linkTimeStamp, isBookmark) {
      patchLinkBookmark(categoryId, linkTimeStamp, isBookmark).then(
        (result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            const code = data.status;
            if (code === 200) {
              this.requesetCategoryList();
              this.requestGetAllLinkList();
            }
          }
        }
      );
    },
    requestDeleteLink() {
      this.isLoading = true;
      deleteLink(this.linkDetail.categoryId, this.linkDetail.linkTimeStamp)
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            const code = data.status;
            if (code === 200) {
              this.snackBarContent = `${this.$i18n.t("snackbar_delete_link")}`;
              this.isShowSnackBar = true;
              setTimeout(() => {
                this.isShowSnackBar = false;
              }, 2000);
              this.requesetCategoryList();
              this.requestGetAllLinkList();
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestPatchLink() {
      this.isLoading = true;
      patchLinkEdit(
        this.reqLinkAdd,
        this.linkDetail.categoryId,
        this.linkDetail.linkTimeStamp
      )
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            const code = data.status;
            if (code === 200) {
              this.isLinkEdit = false;
              this.isShowModalLinkAdd = false;

              this.snackBarContent = `${this.$i18n.t("snackbar_update_link")}`;
              this.isShowSnackBar = true;
              setTimeout(() => {
                this.isShowSnackBar = false;
              }, 2000);
              this.requesetCategoryList();
              this.requestGetAllLinkList();

              //초기화
              this.linkDetail = {
                categoryId: "",
                categoryName: "",
                linkDomain: "",
                linkId: "",
                linkIsMarked: false,
                linkMemo: "",
                linkThumbnail: "",
                linkTimeStamp: "",
                linkTitle: "",
                linkUrl: "",
                linkHost: "",
              };
              this.reqLinkAdd = {
                categoryId: "",
                title: "",
                url: "",
                thumbnail: "",
                memo: "",
              };
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    requestPostLinkParse() {
      this.isLoading = true;
      postLinkParse(this.reqLinkAdd.url)
        .then((result) => {
          const data = result.data;
          const status = result.status;

          if (status === 200) {
            const code = data.status;
            if (code === 200) {
              let parsingData = data.data;
              this.isLinkCheck = true;
              this.isErrorLink = false;
              // 제목이 없을 경우
              if (parsingData.title.trim() === "") {
                parsingData.title = this.reqLinkAdd.url;
              }
              this.linkUrlParse = parsingData;
              this.reqLinkAdd.thumbnail = parsingData.thumbnail;
              this.reqLinkAdd.title = parsingData.title;
            }
          } else if (status === 400) {
            //올바르지 않은 링크일 경우
            this.isErrorLink = true;
          } else if (status === 404) {
            this.isLinkCheck = false;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    onClickTab(id) {
      this.selectCategory = id;
      this.linkParam.categoryId = id;
      this.requestGetAllLinkList();
    },
    onClickBookmark() {
      this.requestGetAllLinkList();
    },
    onClickLinkItem(categoryId, linkTimeStamp) {
      this.isShowModalLinkDetail = true;
      this.requestGetLinkDetail(categoryId, linkTimeStamp);
    },
    onClickLinkDetailModalClose() {
      this.isShowModalLinkDetail = false;
    },
    onClickLinkEditModal() {
      this.reqLinkAdd.categoryId = this.linkDetail.categoryId;
      this.reqLinkAdd.title = this.linkDetail.linkTitle;
      this.reqLinkAdd.thumbnail = this.linkDetail.linkThumbnail;
      this.reqLinkAdd.url = this.linkDetail.linkUrl;
      this.reqLinkAdd.memo = this.linkDetail.linkMemo;

      if (
        this.linkDetail.linkThumbnail != "" &&
        this.linkDetail.linkTitle != ""
      ) {
        this.isLinkCheck = true;
        this.linkUrlParse.domain = this.linkDetail.linkDomain;
        this.linkUrlParse.thumbnail = this.linkDetail.linkThumbnail;
        this.linkUrlParse.title = this.linkDetail.linkTitle;
      }

      this.isLinkEdit = true;

      this.isShowModalLinkDetail = false;
      this.isShowModalLinkAdd = true;
    },
    onClickDeleteLink() {
      if (confirm(this.$i18n.t("alert_delete_link"))) {
        this.requestDeleteLink();
      }
      this.isShowModalLinkDetail = false;
    },
    onClickEditCategoryBtn() {
      this.isShowModalEditCategory = true;
    },
    onClickEditCategoryClose() {
      this.isShowModalEditCategory = false;
    },
    onClickAddCategory() {
      this.isShowModalEditCategory = false;
      this.isShowModalCategoryAdd = true;
    },
    onClickCategoryAddModalClose() {
      this.isShowModalCategoryAdd = false;
    },
    onClickAddLink() {
      this.linkDetail = {
        categoryId: "",
        categoryName: "",
        linkDomain: "",
        linkId: "",
        linkIsMarked: false,
        linkMemo: "",
        linkThumbnail: "",
        linkTimeStamp: "",
        linkTitle: "",
        linkUrl: "",
        linkHost: "",
      };
      this.reqLinkAdd = {
        categoryId: "",
        title: "",
        url: "",
        thumbnail: "",
        memo: "",
      };
      this.linkUrlParse = {
        title: "",
        thumbnail: "",
      };
      this.isLinkEdit = false;
      this.isLinkCheck = false;
      this.isShowModalLinkAdd = true;
    },
    onClickAddLinkModalClose() {
      if (confirm(this.$i18n.t("alert_input_link"))) {
        this.isShowModalLinkAdd = false;
        this.isLinkCheck = false;
        this.linkUrlParse = {
          title: "",
          thumbnail: "",
          domain: "",
        };
      }
    },
    onClickLinkRegister() {
      if (this.reqLinkAdd.title === "" || this.reqLinkAdd.url === "") {
        return;
      }
      if (this.isLinkEdit) {
        this.requestPatchLink();
        return;
      }
      this.requestPostLinkAdd();
    },
    onClickSettingModal() {
      this.isShowModalSetting = true;
    },
    onClickSettingClose() {
      this.isShowModalSetting = false;
    },
    onClickEditCategoryName(item) {
      this.isShowModalEditCategory = false;
      this.isShowModalCategoryNameEdit = true;
      this.categoryEdit.categoryName = item.categoryName;
      this.categoryEdit.categoryId = item.categoryId;
    },
    onClickCategoryEditModalClose() {
      this.isShowModalCategoryNameEdit = false;
    },
    onClickCategoryDelete() {
      if (confirm(this.$i18n.t("alert_delete_category"))) {
        this.requestDeleteCategory();
      }
    },
    onChangeCategory() {
      this.requestPatchCategoryOrder();
    },
    onClickLogout() {
      const loginType = sessionStorage.getItem("loginType");
      if (loginType === "naver") {
        const accessToken = sessionStorage.getItem("naverAccessToken");
        getLogout(accessToken, naverClientSecret, naverClientId).then(() => {
          this.$router.push("/");
        });
      } else if (loginType === "google") {
        let google = window.google;
        google.accounts.id.disableAutoSelect();
        this.$router.push("/");
      } else {
        console.log("apple login");
      }
      sessionStorage.clear();
    },
    onChangeLinkInputbox() {
      this.isErrorLink = false;
      this.isLinkCheck = false;
    },
    getUrlHost(linkUrl) {
      const result = new URL(linkUrl);
      return result.host;
    },
    isBookmark(categoryId, linkTimeStamp, isBookmark) {
      this.requestPatchLinkBookmark(categoryId, linkTimeStamp, isBookmark);
    },
    changeSearchValue(event) {
      this.searchList = this.linkList;
      //값이 있으면
      if (event.target.value) {
        this.searchList = this.linkList.filter(function (value) {
          return value.linkTitle.includes(event.target.value);
        }, this);
      }
    },
    onClickCategoryAdd() {
      this.isShowModalCategoryAdd = true;
      this.isShowModalLinkAdd = false;
    },
    moveLink(url) {
      window.open(url);
    },
    copyLink(url) {
      navigator.clipboard.writeText(url).then(() => {
        this.snackBarContent = this.$i18n.t("snackbar_copy_link");
        this.isShowSnackBar = true;
        setTimeout(() => {
          this.isShowSnackBar = false;
        }, 2000);
      });
    },
    onChangeLang() {
      this.$i18n.locale = this.setLang;
    },
  },
};
</script>
<style scoped>
.loadingBg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: #0000003f;
}
.loading {
  width: 150px;
  height: 150px;
}
.home {
  height: 100%;
}
.linkHeader {
  width: 100%;
  height: 96px;
  border-bottom: 1px solid var(--gray200);
  display: flex;
  align-items: center;
}
.logo {
  padding: 28px 24px;
  margin-left: 16px;
}
.logo .logoImg {
  width: 30px;
}
.settingIcon {
  width: 24px;
}
.searchBox {
  padding: 28px 0;
  flex: 1;
  display: flex;
}
.searchBox .searchIcon {
  width: 20px;
  height: 20px;
  position: absolute;
  padding: 10px 0 10px 10px;
}
.searchBox .inputBox {
  border-radius: 999px;
  border: 1px solid var(--gray200);
  background-color: var(--white);
  padding: 11.5px 11.5px 11.5px 40px;
  flex: 1;
  font-size: 14px;
}
.searchBox .inputBox::placeholder {
  color: var(--gray200);
}
.bookmark {
  margin-left: 20px;
  text-align: center;
  /* cursor: pointer; */
}
/* .bookmark .bookmarkIcon {
  width: 16px;
} */
.bookmark input[type="checkbox"] {
  display: none;
}
.bookmark input[type="checkbox"] + label {
  background: url("../../public/images/bookmark_icon.png") no-repeat;
  background-size: cover;
  width: 16px;
  height: 16px;
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
  margin: 4px;
}
.bookmark input[type="checkbox"]:checked + label {
  background: url("../../public/images/ic_bookmark_fill.png") no-repeat;
  background-size: cover;
}
.bookmark .bookmarkCnt {
  color: var(--gray400);
  font-size: 12px;
}
.bookmark .on {
  color: var(--blue500);
}
.setting {
  margin: 0 12px;
  cursor: pointer;
}
.settingIcon {
  width: 24px;
}
@media screen and (max-width: 834px) {
  .logo {
    display: none;
  }
  .searchBox {
    padding: 28px 0 28px 16px;
  }
}
.tabList {
  width: 100%;
  height: 42px;
  border-bottom: 1px solid var(--gray200);
  align-items: center;
  display: flex;
}
.tabInnerList {
  height: 42px;
  display: flex;
  padding: 0 0 0 40px;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
.categoryEdit {
  color: var(--gray400);
  padding: 12px 14px;
  font-size: 14px;
  cursor: pointer;
  border-left: 1px solid var(--gray200);
}
.linkContent {
  height: calc(100% - 140px);
  overflow: auto;
}
.linkList {
  display: grid;
  padding: 24px;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 1024px;
  margin: 0 auto;
  justify-items: center;
}
@media screen and (min-width: 360px) {
  .linkList {
    grid-template-columns: 1fr;
  }
}
@media screen and (min-width: 520px) {
  .linkList {
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (min-width: 768px) {
  .linkList {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@media screen and (min-width: 1024px) {
  .linkList {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
.blank {
  height: 100%;
  text-align: center;
}
.blank .linkEmptyImg {
  width: 73px;
}
.blank .searchEmptyImg {
  width: 57px;
  margin-bottom: 14px;
}
.blank .blankTitle {
  color: var(--gray400);
  font-size: 20px;
}
.blank .blankMiddle {
  color: var(--gray400);
  font-size: 12px;
}
.blank .blankEnd {
  color: var(--gray500);
  font-size: 14px;
}
.blank .blankEnd .point {
  color: var(--blue500);
}
.linkDetailContent {
  padding: 40px 35px 0 35px;
}
.linkDetailContent .title {
  width: 100%;
  font-size: 20px;
  color: gray600;
  display: flex;
}
.linkDetailContent .title .contentTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.linkDetailContent .copyIcon {
  width: 24px;
  cursor: pointer;
}
.linkAddThumbnail {
  width: 100%;
  height: 94px;
  border: 1px var(--gray200) solid;
  border-radius: 8px;
  display: flex;
  margin-top: 12px;
}
.linkAddThumbnail .thumbnailImg {
  width: 94px;
  object-fit: cover;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
.linkAddThumbnail .explain {
  width: calc(100% - 94px);
  position: relative;
}
.linkAddThumbnail .explain .linkThumbnailTitle {
  width: calc(100% - 28px);
  font-size: 13px;
  color: var(--gray600);
  padding: 17px 15px 14px 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.linkAddThumbnail .explain .linkUrl {
  position: absolute;
  bottom: 0;
  font-size: 12px;
  color: var(--gray400);
  padding: 0 0 15px 13px;
}
.linkDetailThumbnail {
  cursor: pointer;
  width: 100%;
  height: 94px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  display: flex;
  background-color: var(--gray50);
  margin-top: 12px;
}
.linkDetailThumbnail .thumbnailImg {
  width: 94px;
  object-fit: cover;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.linkDetailThumbnail .explain {
  width: calc(100% - 94px);
  position: relative;
}
.linkDetailThumbnail .explain .linkThumbnailTitle {
  width: calc(100% - 31px);
  font-size: 13px;
  color: var(--gray600);
  padding: 17px 15px 14px 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.linkDetailThumbnail .explain .linkUrl {
  position: absolute;
  bottom: 0;
  font-size: 12px;
  color: var(--gray400);
  padding: 0 0 15px 13px;
}
.linkDetailContent .memo {
  margin-top: 18px;
  font-size: 12px;
  color: var(--gray400);
}
.linkDetailContent .memoIcon {
  width: 14px;
  vertical-align: text-top;
}
.linkDetailContent .memo .memoContent {
  height: 148px;
}
.modal .modalBtn {
  font-size: 14px;
  color: var(--gray400);
  padding: 22px 0 4px 0;
  border-top: 1px solid var(--gray100);
}
.modal .modalBtn .btnBox {
  display: flex;
  justify-content: center;
  cursor: pointer;
}
.plusBlueIcon {
  width: 20px;
  vertical-align: text-bottom;
}
.linkDetailContent .delete {
  color: var(--gray400);
}
.linkDetailContent .delete .deleteIcon {
  width: 17px;
  margin-right: 4px;
  vertical-align: text-bottom;
}
.categoryEditContent {
  padding: 34px 28px 0 28px;
}
.categoryEditContent .add {
  color: var(--blue500);
}
.myCategoryList {
  margin-top: 12px;
  height: 245px;
}
.myCategoryList .myCategoryItem {
  display: flex;
  margin-top: 8px;
}
.myCategoryList .myCategoryItem .categoryNm {
  font-size: 18px;
  color: var(--gray600);
}
.myCategoryList .myCategoryItem .linkCnt {
  font-size: 14px;
  color: var(--blue500);
  margin-left: 4px;
}
.myCategoryList .myCategoryItem .linkEmpty {
  color: var(--gray300) !important;
}
.myCategoryList .myCategoryItem .editIcon {
  width: 12px;
  vertical-align: middle;
}
.myCategoryList .myCategoryItem .editBtn {
  font-size: 13px;
  color: var(--gray300);
  margin-right: 22px;
  cursor: pointer;
}
.myCategoryList .myCategoryItem .drag {
  width: 20px;
  /* text-align: center; */
}
.myCategoryList .myCategoryItem .drag .dragAndDropIcon {
  width: 16px;
  cursor: ns-resize;
}
.categoryTotalCnt {
  font-size: 12px;
  color: var(--gray400);
}
.categoryDelete {
  font-size: 12px;
  color: var(--gray600);
  margin-top: 10px;
  cursor: pointer;
}

.linkAddContent {
  height: 580px;
  overflow: auto;
  padding: 4px 24px;
}
.linkAddContent .subHeader {
  font-size: 13px;
  color: var(--gray400);
  margin-bottom: 13px;
  font-weight: 400;
}
.linkAddContent .categorySelect {
  display: flex;
}
.linkAddContent .categorySelect .linkCategoryAdd {
  font-weight: 300;
  font-size: 12px;
  cursor: pointer;
}
.linkAddContent .categorySelect .linkCategoryAdd img {
  width: 14px;
  padding-left: 2px;
  vertical-align: text-bottom;
}
.linkAddContent .urlInputBox {
  position: relative;
}
.linkAddContent .urlInputBox .inputBox:disabled {
  color: var(--gray300);
}
.linkAddContent .errorLink {
  color: var(--red);
  font-size: 12px;
  padding-top: 8px;
}
.linkAddContent .inputBox {
  width: calc(100% - 74px);
  border-radius: 4px;
  background-color: var(--gray50);
  padding: 14px 58px 14px 16px;
  font-size: 13px;
  border: 0;
}
.linkAddContent .checkUrl {
  position: absolute;
  right: 10px;
  top: 10px;
  color: var(--gray300);
  font-size: 12px;
  border: 1px solid var(--gray300);
  border-radius: 28px;
  padding: 5px 8px;
  cursor: pointer;
}
.linkAddContent .checkIcon {
  width: 24px;
  height: 24px;
  position: absolute;
  right: 12px;
  top: 10px;
}
.linkAddContent .linkTitle {
  width: 100%;
  font-size: 14px;
  border: none;
  border-bottom: 1px solid var(--gray200);
  padding: 8px 0;
}
.linkAddContent .categoryList {
  display: flex;
  flex-wrap: wrap;
  /* margin: 26px 0; */
}
.linkAddContent .categoryList input[type="radio"] + label {
  display: inline;
  cursor: pointer;
  border: 1px solid var(--blue500);
  border-radius: 12px;
  padding: 13px;
  color: var(--blue500);
  font-size: 13px;
  margin: 0 8px 8px 0;
}
.linkAddContent .categoryList input[type="radio"] {
  display: none;
  -webkit-appearance: none;
}
.linkAddContent .categoryList input[type="radio"]:checked + label {
  display: inline;
  cursor: pointer;
  border: 1px solid var(--blue500);
  border-radius: 12px;
  padding: 13px;
  background-color: var(--blue500);
  color: var(--white);
  font-size: 13px;
  margin-right: 8px;
}
.linkAddContent .memoContent {
  resize: none;
  border: 0;
  width: calc(100% - 32px);
  background-color: var(--gray50);
  border-radius: 12px;
  color: var(--gray300);
  font-size: 13px;
  padding: 16px;
  height: 135px;
  margin-bottom: 82px;
}

.linkAddContent .inputBox::placeholder {
  color: var(--gray400);
}
.linkAddBtn {
  position: absolute;
  bottom: 0;
}

.addBtn {
  width: 50px;
  height: 50px;
  background-color: var(--blue500);
  color: var(--white);
  text-align: center;
  position: fixed;
  right: 40px;
  bottom: 40px;
  border-radius: 100px;
  cursor: pointer;
  align-content: center;
}

.plusIcon {
  width: 22px;
}
.editCategoryContent {
  margin: 15px 24px 0 24px;
  height: 239px;
}
.editCategoryContent .editCategoryNameTitle {
  color: var(--gray400);
  font-size: 12px;
}
.editCategoryContent input[type="text"] {
  width: calc(100% - 35px);
  color: var(--gray900);
  font-size: 18px;
  background-color: var(--gray50);
  border: 0;
  border-radius: 4px;
  padding: 14px 16px;
}
.editCategoryContent .categoryDelete {
  color: var(--gray400);
  font-size: 13px;
  margin-top: 37px;
  text-align: center;
}
.categoryDeleteIcon {
  width: 16px;
  vertical-align: text-bottom;
}

/**
설정 헤더
*/
.settingContent {
  height: 350px;
  padding: 0 20px;
}
.mySub1 {
  font-size: 10px;
  color: var(--gray400);
}
.myCon1 {
  display: flex;
}
.myEmail {
  font-size: 18px;
  color: var(--gray800);
  margin-top: 2px;
}
.myManageBtn {
  font-size: 12px;
  color: var(--blue500);
  border-radius: 28px;
  padding: 8px 5px;
  border: 1px solid var(--blue500);
}
.myCon3 {
  margin-top: 32px;
}
.setList {
  padding: 12px 0;
}
.setLang {
  display: flex;
}
.setLang select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: 0;
  outline: none;
  text-indent: 1px;
  font-size: 16px;
  color: var(--gray300);
}
.setLang .arrowIcon {
  width: 20px;
  height: 20px;
  vertical-align: text-bottom;
}
.setVersion {
  display: flex;
}
.setListItem {
  font-size: 14px;
  color: var(--gray400);
}
.setLangItem {
  font-size: 16px;
  color: var(--gray300);
}
.setVersionItem {
  font-size: 16px;
  color: var(--gray300);
}
.withDraw {
  font-size: 14px;
  color: var(--gray300);
  cursor: pointer;
}
.snackBar {
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 40px;
  background-color: var(--white);
  border-radius: 8px;
  color: var(--gray900);
  font-size: 14px;
  padding: 20px 12px;
  display: flex;
  z-index: 10;
}
.snackBar .checkIcon {
  width: 24px;
}
.snackBar .content {
  margin-left: 12px;
  padding: 4px 0;
}

/**
모달 헤더 관련
 */
.contentHeader {
  display: flex;
  padding: 20px 20px 0 20px;
}
.contentHeader .title {
  flex: 1;
  font-size: 16px;
  text-align: center;
  color: var(--gray500);
}
.contentHeader .leftHeader {
  font-size: 16px;
  cursor: pointer;
  color: var(--blue500);
}
.contentHeader .centerHeader {
  font-size: 16px;
  color: var(--gray300);
}
.contentHeader .rightHeader {
  font-size: 16px;
  color: var(--gray500);
}
.contentHeader .linkAddTitle {
  flex: 1;
  text-align: center;
  color: var(--gray600);
  font-size: 14px;
}
.contentHeader .closeIcon {
  width: 24px;
  cursor: pointer;
}
.contentHeader .complete {
  cursor: pointer;
}
</style>
