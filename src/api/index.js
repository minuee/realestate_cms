import { Api } from "@psyrenpark/api";
import axios from "axios";
import dayjs from "dayjs";
import { encrypt, decrypt, listIndex, dateFormat, randInt, divByBillion } from "common";
import { IMAGE_BASE_URL } from "env";
const userType = "admin"; // admin - cust
const projectName = "gp" + userType;
const projectEnv = "prod";

const v1Api = `${projectName}-${projectEnv}-api-v1`;
const v1Cdn = `${projectName}-${projectEnv}-cdn-v1`;
const v1NoneAuth = `${projectName}-${projectEnv}-noneauth-v1`;
const v1Cms = `${projectName}-${projectEnv}-cms-v1`;


export const apiObject = {
  getMemberList: async ({
    member_type,
    page = 1,
    paginate = 10,
    search_word,
    search_word2,
    term_start,
    term_end,
    sort_item,
    sort_type,
    is_status = ''
  }) => {
    try {
      let type = v1Cdn;
      let path = "/member/list";
      let option = {
        headers: {},
        queryStringParameters: {
          member_type,
          page,
          paginate,
          search_word,
          search_word2 : encrypt(search_word2),
          term_start: dateFormat(term_start, "s"),
          term_end: dateFormat(term_end, "e"),
          sort_item,
          sort_type,
          is_status
        },
      };

      let data = await Api.get(type, path, option);      
      const settleUserList = data.data.settleUserList;
      
      data.data.userList.forEach(async(item, index) => {
        item.no = listIndex(data.total, data.currentPage, index);
        item.uid = decrypt(item.uid);
        item.telephone = decrypt(item.telephone);
        
        switch (item.is_status) {
          case "use":
            item.is_status_text = "이용중";
            break;
          case "stop":
            item.is_status_text = "중지";
            break;
          case "block":
            item.is_status_text = "이용중지";
            break;
          case "wait":
            item.is_status_text = "대기중";
            break;
          case "request":
            item.is_status_text = "승인신청중";
            break;
          case "approval":
            item.is_status_text = "승인";
            break;
          case "reject":
            item.is_status_text = "승인거절";
            break;
        }
        if ( item.agent ) {
          switch (item.agent.is_status) {
            case "wait":
              item.agent_status_text = "대기중";
              break;
            case "request":
              item.agent_status_text = "승인신청중";
              break;
            case "approval":
              item.agent_status_text = "승인";
              break;
            case "reject":
              item.agent_status_text = "승인거절";
              break;
            default :
              item.agent_status_text = "대기중";
              break;
          }
          item.confirm_date = item.agent.confirm_date;
          let isSettle = await settleUserList.filter(info => info.member_pk == item.member_pk);
          item.isServiceIng = false;
          if ( isSettle.length > 0 ) {
            item.isServiceIng = true;
          }
          //console.log('isSettle',isSettle)
        }

        switch (item.join_type) {
          case "Z":
            item.join_type_text = "착한부동산";
            break;
          case "A":
            item.join_type_text = "애플";
            break;
          case "N":
            item.join_type_text = "네이버";
            break;
          case "K":
            item.join_type_text = "카카오";
            break;
          case "G":
            item.join_type_text = "구글";
            break;
        }
      });

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getMemberDetail: async ({ member_pk }) => {
    try {
      let type = v1Cdn;
      let path = `/member/detail/${member_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };
      let data = await Api.get(type, path, option, () => {});
      let ret = data.data;

      ret.uid = decrypt(ret.uid);
      ret.telephone = decrypt(ret.telephone);

      switch (ret.is_status) {
        case "use":
          ret.is_status_text = "이용중";
          break;
        case "stop":
          ret.is_status_text = "중지";
          break;
        case "block":
          ret.is_status_text = "이용중지";
          break;
        case "request":
          ret.is_status_text = "대기중";
          break;
        case "approve":
          ret.is_status_text = "승인";
          break;
        case "reject":
          ret.is_status_text = "거절";
          break;
      }
      
      
      switch (ret.join_type) {
        case "Z":
          ret.join_type_text = "착한부동산";
          break;
        case "A":
          ret.join_type_text = "애플";
          break;
        case "N":
          ret.join_type_text = "네이버";
          break;
        case "K":
          ret.join_type_text = "카카오";
          break;
        case "G":
          ret.join_type_text = "구글";
          break;
      }

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getDealerDetail: async ({ member_pk }) => {
    try {
      let type = v1Cdn;
      let path = `/member/detail/${member_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };
      let data = await Api.get(type, path, option, () => {});
      let ret = data.data;

      ret.uid = decrypt(ret.uid);
      ret.telephone = decrypt(ret.telephone);


      switch (ret.agent_status) {
        case "request":
          ret.is_agent_status_text = "승인신청중";
          break;
        case "approval":
          ret.is_agent_status_text = "승인";
          break;
        case "reject":
          ret.is_agent_status_text = "거절";
          break;
        default:
          ret.is_agent_status_text = "대기중";
          break;
      }
      
      switch (ret.join_type) {
        case "Z":
          ret.join_type_text = "착한부동산";
          break;
        case "A":
          ret.join_type_text = "애플";
          break;
        case "N":
          ret.join_type_text = "네이버";
          break;
        case "K":
          ret.join_type_text = "카카오";
          break;
        case "G":
          ret.join_type_text = "구글";
          break;
      }

      return ret;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  removeMember: async ({ member_pk }) => {
    try {
      let type = v1Api;
      let path = `/member/remove/${member_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };
      return await Api.del(type, path, option);
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  approveDealer: async ({ is_approval, member_pk }) => {
    try {
      let type = v1Api;
      // let type = v1Cdn;
      let path = `/member/approval/${member_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
        body: {
          is_approval,
        },
      };
      return await Api.put(type, path, option);
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  updateDealer: async ({ 
    member_pk,
    business_code,
    telephone,
    address,
    area_code,
    zipcode,
    name,
    company_name
  }) => {
    
    console.log('member_pk',member_pk);
    console.log('business_code',business_code);
    console.log('telephone',encrypt(telephone));
    console.log('address',address);
    console.log('area_code',area_code);
    console.log('zipcode',zipcode);
    console.log('name',name);
    console.log('company_name',company_name);
    
    const encTelephone = encrypt(telephone);
    try {
      let type = v1Api;
      let path = `/member/modagent/${member_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
        body: {
          business_code,
          telephone : encTelephone,
          address,
          area_code,
          zipcode,
          name,
          company_name
        },
      };
      return await Api.put(type, path, option);
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
    
  },

  // getReviewList: async ({ member_pk, page = 1, paginate = 10, term_start, term_end }) => {
  //   try {
  //     let type = v1Cdn;
  //     let path = `/reviews/list/${member_pk}`;
  //     let option = {
  //       headers: {},
  //       queryStringParameters: {
  //         page,
  //         paginate,
  //         term_start: dateFormat(term_start, "s"),
  //         term_end: dateFormat(term_end, "e"),
  //       },
  //     };

  //     let data = await Api.get(type, path, option);

  //     return data;
  //   } catch (e) {
  //     alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
  //     console.log({ e });
  //     return {};
  //   }
  // },
  getReplyList: async ({ target_pk, class_type, page = 1, paginate = 10 }) => {
    try {
      let type = v1Cdn;
      let path = `/reply/list`;
      let option = {
        headers: {},
        queryStringParameters: {
          target_pk,
          // target_pk: 1,
          class_type,
          page,
          paginate,
        },
      };

      let data = await Api.get(type, path, option);

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },
  removeReply: async ({ reply_pk }) => {
    try {
      let type = v1Api;
      let path = `/reply/remove/${reply_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };

      return await Api.del(type, path, option);
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  getHouseArea: async ({ area_sido, area_sigungu }) => {
    try {
      let type = v1Cdn;
      let path = "/apart/area";
      let option = {
        headers: {},
        queryStringParameters: {
          area_sido,
          area_sigungu,
        },
      };

      let data = await Api.get(type, path, option);

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getHouseList: async ({
    page = 1,
    paginate = 10,
    search_word,
    sort_item,
    sort_type,
    area_sido,
    area_sigungu,
    area_eupmyeon,
  }) => {
    try {
      let type = v1Cdn;
      let path = "/apart/list";
      let option = {
        headers: {},
        queryStringParameters: {
          page,
          paginate,
          search_word,
          sort_item,
          sort_type,
          area_sido,
          area_sigungu,
          area_eupmyeon,
        },
      };

      let data = await Api.get(type, path, option);

      data.data.forEach((item, index) => {
        item.no = listIndex(data.data[0].full_count, data.currentPage, index);
        item.rent_avg_price = divByBillion(item.rent_avg_price);
        item.trade_avg_price = divByBillion(item.trade_avg_price);
        item.trade_fast_deal = divByBillion(item.trade_fast_deal);
      });

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getHouseDetail: async ({ apart_code, fast_deal_pk }) => {
    try {
      let type = v1Cdn;
      let path = `/apart/article/${apart_code}`;
      let option = {
        headers: {},
        queryStringParameters: {
          fast_deal_pk,
        },
      };
      let data = await Api.get(type, path, option, () => {});

      data.data.forEach((item) => {
        item.rent_avg_price = divByBillion(item.rent_avg_price);
        item.trade_avg_price = divByBillion(item.trade_avg_price);
        item.trade_fast_rent = divByBillion(item.trade_fast_rent);
        item.trade_fast_deal = divByBillion(item.trade_fast_deal);
        // item.homepage = "http://www.google.com";
      });

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },

  getCommunityFeedList: async ({
    page = 1,
    paginate = 10,
    search_word,
    term_start,
    term_end,
    sort_item,
    sort_type,
    board_type
  }) => {
    try {
      let type = v1Cdn;
      let path = "/story/estate/list";
      let option = {
        headers: {},
        queryStringParameters: {
          page,
          paginate,
          search_word,
          term_start: dateFormat(term_start, "s"),
          term_end: dateFormat(term_end, "e"),
          sort_item,
          sort_type,
          board_type
        },
      };

      let data = await Api.get(type, path, option);
      console.log('option',option)
      data.data.storyList.forEach((item, index) => {
        item.no = listIndex(data.total, data.currentPage, index);
        let navTitle = '자유게시판'
        switch(item.board_type) {
            case 'Dialog' : navTitle = '가입인사';break;
            case 'Realestate' : navTitle = '부동산뉴스';break;
            case 'Deal' : navTitle = '급매물게시판';break;
            case 'Owner' : navTitle = '재파게시판';break;
            default : navTitle = '자유게시판';break;
        }
        item.board_type_name = navTitle;
      });

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getCommunityFeedDetail: async ({ estate_story_pk }) => {
    try {
      let type = v1Cdn;
      let path = `/story/estate/detail/${estate_story_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {
          is_cms: true,
        },
      };

      let data = await Api.get(type, path, option);
      console.log('IMAGE_BASE_URL',IMAGE_BASE_URL);
      //console.log('getCommunityFeedDetail',data);
      let navTitle = '자유게시판'
      switch(data.data.estateStory.board_type) {
        case 'Dialog' : navTitle = '가입인사';break;
        case 'Realestate' : navTitle = '부동산뉴스';break;
        case 'Deal' : navTitle = '급매물게시판';break;
        case 'Owner' : navTitle = '재파게시판';break;
        default : navTitle = '자유게시판';break;
      }
      data.data.estateStory.board_type_name = navTitle;
      data.data.estateStory.str_is_notice =  data.data.estateStory.is_notice ? '네' : '아니오';
      let imageList = [];
      if ( data.data.estateStory.image_1 != '' ) {
        imageList.push({img_url : IMAGE_BASE_URL + data.data.estateStory.image_1 })
      }
      if ( data.data.estateStory.image_2 != '' ) {
        imageList.push({img_url : IMAGE_BASE_URL + data.data.estateStory.image_2 })
      }
      data.data.estateStory.imageList = imageList;
      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  removeCommunityFeed: async ({ estate_story_pk }) => {
    try {
      let type = v1Api;
      let path = `/story/estate/remove/${estate_story_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };

      // console.log(estate_story_pk);
      let response = await Api.del(type, path, option);

      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  updateBoardNotice: async ({ estate_story_pk, is_bool }) => {
    try {
      let type = v1Api;
      let path = `/story/estate/notice/${estate_story_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {
          is_notice : is_bool
        },
      };

      // console.log(estate_story_pk);
      let response = await Api.get(type, path, option);

      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  registCommunityReply: async ({ estate_story_pk,answerContent,fixedAdminPk }) => {
    console.log('estate_story_pk',estate_story_pk);
    console.log('answerContent',answerContent);
    console.log('fixedAdminPk',fixedAdminPk);
    
    try {
      let type = v1Api;
      let path = `/reply/admin`;
      let option = {
        headers: {},
        body: {
          class_type : 'House',
          target_pk : parseInt(estate_story_pk),
          contents : answerContent.trim(),
          member_pk : fixedAdminPk
        },
        queryStringParameters: {},
      };

      // console.log(estate_story_pk);
      let response = await Api.post(type, path, option);

      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  getHouseCommunityList: async ({
    page = 1,
    paginate = 10,
    search_word,
    sort_item,
    sort_type,
    area_sido,
    area_sigungu,
    area_eupmyeon,
  }) => {
    try {
      let type = v1Cdn;
      let path = "/apart/story/list";
      let option = {
        headers: {},
        queryStringParameters: {
          page,
          paginate,
          search_word,
          sort_item,
          sort_type,
          area_sido,
          area_sigungu,
          area_eupmyeon,
        },
      };

      let data = await Api.get(type, path, option);

      data.data.forEach((item, index) => {
        item.no = listIndex(data.data[0].full_count, data.currentPage, index);
      });

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
  getHouseFeedList: async ({ apart_code, page = 1, paginate = 10, search_word }) => {
    try {
      let type = v1Cdn;
      let path = "/story/apart/cmslist";
      let option = {
        headers: {},
        queryStringParameters: {
          complexno: apart_code,
          page,
          paginate,
          search_word,
        },
      };

      let data = await Api.get(type, path, option);

      data.data.apartStoryList.forEach((item, index) => {
        item.no = listIndex(data.total, data.currentPage, index);
      });

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getHouseFeedDetail: async ({ apart_story_pk }) => {
    try {
      let type = v1Api;
      let path = `/story/apart/detail/${apart_story_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };

      let data = await Api.get(type, path, option);

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  removeHouseFeed: async ({ apart_story_pk }) => {
    try {
      let type = v1Api;
      let path = `/story/apart/remove/${apart_story_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };

      let response = await Api.del(type, path, option);
      return response;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  getSubscribeList: async ({
    page = 1,
    paginate = 10,
    search_word,
    term_start,
    term_end,
    sort_item,
    sort_type,
    is_status = "none",
    gubun = ''
  }) => {
    try {
      let type = v1Api;
      let path = "/settlement/list";
      let option = {
        headers: {},
        queryStringParameters: {
          page,
          paginate,
          search_word,
          term_start: dateFormat(term_start, "s"),
          term_end: dateFormat(term_end, "e"),
          sort_item,
          sort_type,
          is_status,
          gubun
        },
      };

      let data = await Api.get(type, path, option);

      data.data.settlementList.forEach((item, index) => {
        item.no = listIndex(data.total, data.currentPage, index);
        item.nickname = item.member.nickname;
        item.uid = decrypt(item.member.uid);

        switch (item.is_status) {
          case "none":
            item.status_text = "없음";
            break;
          case "ing":
            item.status_text = "이용중";
            break;
          case "stop":
            item.status_text = "해지신청";
            break;
          case "end":
            item.status_text = "해지";
            break;
        }
        switch (item.gubun) {
          case "alarm":
            item.gubun_text = "급매물서비스";
            break;
          case "agent":
            item.gubun_text = "착한중개인";
            break;
          default : 
            item.gubun_text = "급매물서비스";
            break;
        }
      });

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getSubscribeDetail: async ({ settlement_pk }) => {
    try {
      let type = v1Api;
      let path = `/settlement/detail/${settlement_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };

      let data = await Api.get(type, path, option);

      data.data.settlement.member.uid = decrypt(data.data.settlement.member.uid);
      switch (data.data.settlement.is_status) {
        case "none":
          data.data.settlement.status_text = "없음";
          break;
        case "ing":
          data.data.settlement.status_text = "이용중";
          break;
        case "stop":
          data.data.settlement.status_text = "해지신청";
          break;
        case "end":
          data.data.settlement.status_text = "해지";
          break;
      }
      switch (data.data.settlement.gubun) {
        case "alarm":
          data.data.settlement.gubun_text = "급매물서비스";
          break;
        case "agent":
          data.data.settlement.gubun_text = "착한중개인";
          break;
        default : 
          data.data.settlement.gubun_text = "급매물서비스";
          break;
      }

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  modifySubscribeStatus: async ({ settlement_pk, status }) => {
    try {
      let type = v1Cdn;
      let path = `/settlement/modify`;
      let option = {
        headers: {},
        queryStringParameters: {},
        body: {
          settlement_pk,
          status,
        },
      };

      return await Api.patch(type, path, option);
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  getInquiryList: async ({
    page = 1,
    paginate = 10,
    search_word,
    term_start,
    term_end,
    sort_item,
    sort_type,
    inquiry_type,
  }) => {
    try {
      let type = v1Cdn;
      let path = "/member/inquiry/list";
      let option = {
        headers: {},
        queryStringParameters: {
          page,
          paginate,
          search_word,
          term_start: dateFormat(term_start, "s"),
          term_end: dateFormat(term_end, "e"),
          sort_item,
          sort_type,
          inquiry_type,
        },
      };

      let data = await Api.get(type, path, option);

      data.data.inquiryList.forEach((item, index) => {
        item.no = listIndex(data.total, data.currentPage, index);
      });

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  getInquiryDetail: async ({ inquiry_pk }) => {
    try {
      let type = v1Cdn;
      let path = `/member/inquiry/detail/${inquiry_pk}`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };

      let data = await Api.get(type, path, option);

      return data.data?.[0];
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return {};
    }
  },
  replyInquiry: async ({ inquiry_pk, receiver_name, receiver_email, contents, answer_contents }) => {
    let title = `[착한부동산] ${receiver_name}님, 문의해주신 내용에 대하여 답변 보내드립니다`;
    let message = `
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
</head>
<body>
    <div style="display:flex; flex-direction: column; align-items: stretch; justify-content: center; max-width: 600px; margin: auto; padding: 20px">
      <div style="display:flex; align-items: center;">
        <img src="https://gp-prod-file.s3.ap-northeast-2.amazonaws.com/public/email/gp_logo.jpg" alt="착한부동산 로고" width="40" height="40" />
        <p style="font-size: 22px; margin-left: 14px;">착한부동산</p>
      </div>

      <hr style="margin: 10px 0;" />

      <div style="padding: 30px 0">
        <p style="line-height: 2.5; margin: 0;">반갑습니다 착한부동산입니다.</p>
        <p style="line-height: 2.5; margin: 0;">아래와 같이 문의내용에 대한 답변을 드립니다.</p>
      </div>
      
      <h3>- 답변내용</h3>
      <div style="white-space:pre-wrap; min-height: 200px; padding: 14px;">${answer_contents}</div>

      <h3>- 문의내용</h3>
      <div style="white-space:pre-wrap; min-height: 200px; padding: 14px;">${contents}</div>

      <hr style="margin: 10px 0;" />
      <p style="font-size: 12px; text-align: center;">help@realestate.com</p>
  </div>
</body>
</html>
`;

    const config = {
      header: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',        
        withCredentials: false,
        mode: 'no-cors'
      }
    }
    try {
      /*
      let mailResp = await axios.post("https://xamwftqgaa.execute-api.us-east-1.amazonaws.com/default/devSendEmail", {
        toAddress: receiver_email,
        msg: message.trim(),
        title: title,
        type: "HTML",
      },config);
      */
     
      let type = v1Api;
      let path = `/member/inquiry/answer`;
      let option = {
        headers: {},
        queryStringParameters: {},
        body: {
          inquiry_pk: +inquiry_pk,
          answer_contents,
          toAddress: receiver_email,
          email_contents: message,
        },
      };

      let resp = await Api.put(type, path, option, () => {});
      return resp;      
    } catch (e) {
      // alert("문의 답변을 발송하는데 오류가 발생했습니다");
      console.log({ e });
    }
  },

  getTerms: async () => {
    try {
      let type = v1Cdn;
      let path = `/common/yakwan/1`;
      let option = {
        headers: {},
        queryStringParameters: {},
      };
      let data = await Api.get(type, path, option, () => {});

      return data.data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return "";
    }
  },
  updateTerm: async ({ term_type, content }) => {
    try {
      let type = v1Cdn;
      let path = `/common/yakwan/${term_type}/${1}`;
      let option = {
        headers: {},
        queryStringParameters: {},
        body: {
          [`${term_type}_stipulation`]: content,
        },
      };
      let resp = await Api.put(type, path, option, () => {});

      return resp;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
    }
  },

  getReportList: async ({
    page = 1,
    paginate = 10,
    search_word,
    term_start,
    term_end,
    sort_item,
    sort_type,
    class_type,
    reason_type,
  }) => {
    try {
      let type = v1Cdn;
      let path = "/declaration/list";
      let option = {
        headers: {},
        queryStringParameters: {
          page,
          paginate,
          search_word,
          term_start: dateFormat(term_start, "s"),
          term_end: dateFormat(term_end, "e"),
          sort_item,
          sort_type,
          class_type,
          reason_type,
        },
      };

      let data = await Api.get(type, path, option);

      data.data.declarationList.forEach((item, index) => {
        item.no = listIndex(data.total, data.currentPage, index);

        switch (item.class_type) {
          case "chat":
            item.class_text = "채팅";
            break;
          case "apartstory":
            item.class_text = "아파트이야기";
            break;
          case "housestory":
            item.class_text = "부동산이야기";
            break;
        }

        switch (item.reason_type) {
          case "A":
            item.reason_text = "영리목적/홍보성";
            break;
          case "B":
            item.reason_text = "음란성/선정성";
            break;
          case "C":
            item.reason_text = "개인정보노출";
            break;
          case "Z":
            item.reason_text = "기타";
            break;
        }
      });

      return data;
    } catch (e) {
      alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
      console.log({ e });
      return [];
    }
  },
};
