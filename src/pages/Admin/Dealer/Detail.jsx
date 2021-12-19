import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm, FormProvider, useFormContext, Controller, UseControllerReturn } from "react-hook-form";
import { useQuery, useQueries, useMutation } from "react-query";
import { useSearchParams, useConfirmModal } from "hooks";
import { apiObject } from "api";
import dayjs from "dayjs";
import { IMAGE_BASE_URL } from "env";

import { makeStyles, Box, Grid,TextField } from "@material-ui/core";
import { DeleteOutlined, ImageOutlined, Star } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { Typography, Button } from "components/Mui";
import { RowTable, ColumnTable, Title, Image, ReplyList } from "components";

const isEmpty = str => {
  return str === null || str === undefined || str === '' || (typeof str === 'object' && Array.isArray(str) === false && Object.keys(str).length === 0);
};

const useStyles = makeStyles((theme) => ({
  inner_table: {
    "& .MuiTableCell-root": {
      borderBottom: "none",
    },
    "& th": {
      background: "#fff",
    },
  },
}));

// const review_columns = [
//   { Header: "번호", accessor: "no", width: 80 },
//   { Header: "작성자", accessor: "name", width: 240 },
//   { Header: "내용", accessor: "content" },
//   {
//     Header: "작성일자",
//     id: "reg_date",
//     accessor: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD"),
//     width: 120,
//   },
//   {
//     Header: "삭제",
//     id: "delete",
//     accessor: ({ no }) => (
//       <Button variant="text" onClick={() => console.log(no)}>
//         <DeleteOutlined color="disabled" />
//         <Typography variant="body2" color="textSecondary">
//           삭제
//         </Typography>
//       </Button>
//     ),
//     width: 160,
//   },
// ];

export const DealerDetail = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { member_pk } = useParams();
  const { search_params, Pagination, TermBox } = useSearchParams(location);
  const [dealer,review] = useQueries([
    { queryKey: ["getDealerDetail", { member_pk }] },
    // { queryKey: ["getReplyList", { target_pk: member_pk, class_type: "Agent", ...search_params }] },
  ]);

  useEffect(() => {
    let isRepeat = 1;
    console.log('useEffect',dealer.data)
    if( !isEmpty(dealer) ){
      if( !isEmpty(dealer.data)){
        isRepeat =2;
        setBusinessCode(dealer.data.business_code)
        setTelephone(dealer.data.telephone)
        setAddress(dealer.data.address)
        setCeoName(dealer.data.name)
        setCompanyName(dealer.data.company_name)
      }
    }
  },[])
  const removeMutation = useMutation(apiObject.removeMember);
  const approveMutation = useMutation(apiObject.approveDealer, { onSuccess: dealer.refetch });
  const updateMutation = useMutation(apiObject.updateDealer, { 
    onError : () =>  alert("오류가 발생되어 수정되지 않았습니다."),
    onSuccess: () => (
      dealer.refetch,
      setTimeout(() => {
        setModifyMode(false);
        history.go(0)
      }, 500)
      
    ),
  });
  const { ConfirmModal, openModal } = useConfirmModal(["delete", "approve","modify"]);
 
  async function removeDealer() {
    removeMutation.mutate({ member_pk });
    history.push("/member/dealer");
  }
  async function approveDealer({ is_approval }) {
    approveMutation.mutate({ is_approval, member_pk ,rejectWord});
  }
  async function openModify() {
    console.log('openModify',dealer.data)
    await setBusinessCode(dealer.data.business_code)
    await setTelephone(dealer.data.telephone)
    await setAddress(dealer.data.address)
    await setCeoName(dealer.data.name)
    await setCompanyName(dealer.data.company_name)
    setModifyMode(true);
  }
  async function updateDealer({ 
    member_pk,
    business_code,
    telephone,
    address,
    area_code,
    zipcode,
    name,
    company_name
   }) {
    updateMutation.mutate({ 
      member_pk,
      business_code  : isEmpty(business_code) ? dealer.data.business_code : business_code,
      telephone: isEmpty(telephone) ? dealer.data.telephone : telephone,
      address: isEmpty(address) ? dealer.data.address : address,
      area_code: isEmpty(area_code) ? dealer.data.area_code : area_code,
      zipcode: isEmpty(zipcode) ? dealer.data.zipcode : zipcode,
      name: isEmpty(name) ? dealer.data.name : name,
      company_name : isEmpty(company_name) ? dealer.data.company_name : company_name,
    });
    
  }
  
  const [rejectWord, setRejectWord] = useState('');
  const [isModifyMode, setModifyMode] = useState(false);
  const [reBusinessCode, setBusinessCode] = useState(dealer.business_code);
  const [reTelephone, setTelephone] = useState(dealer.telephone);
  const [reAddress, setAddress] = useState(dealer.address);
  const [reCeoName, setCeoName] = useState(dealer.name);
  const [reCompanyName, setCompanyName] = useState(dealer.company_name);
  
  const table_head = [
    {
      head: ({ agent_img_url, star_point }) => (
        <Box width="100%">
          {dealer.isLoading ? (
            <Skeleton variant="rect" width="170px" height="170px" />
          ) : (
            <Image height="170px" src={agent_img_url ? IMAGE_BASE_URL + agent_img_url : agent_img_url} />
          )}

          <Box mt={1} display="flex" justifyContent="center" alignItems="center">
            <Star color="primary" />
            <Typography ml={0.5} color="primary" fontWeight="700">
              {star_point ? parseFloat(star_point).toFixed(1) : "-"}
            </Typography>
          </Box>
        </Box>
      ),
      render: (data) => {
        const inner_head = [
          [
            { head: "이메일주소", key: "uid" },
            isModifyMode ? 
            { head: "사업자명",
              render: ({ company_name }) => (
                <Box width={'88%'}>  
                  <TextField
                    defaultValue={company_name}
                    multiline={false}
                    size={"small"}
                    placeholder={'사업자명'}
                    style={{ height: "25px",width:'200px' }}
                    onChange={(e) => setCompanyName(e.target.value.trim())}
                  />
                </Box>
              )
            }
            :
            { head: "사업자명", key: "company_name" },
          ],
          [
            isModifyMode ? 
            { head: "대표자명",
              render: ({ name }) => (
                <Box width={'88%'}>  
                  <TextField
                    defaultValue={name}
                    multiline={false}
                    size={"small"}
                    placeholder={'대표자명'}
                    style={{ height: "25px",width:'200px' }}
                    onChange={(e) => setCeoName(e.target.value.trim())}
                  />
                </Box>
              )
            }
            :
            { head: "대표자명", key: "name" },
            isModifyMode ? 
            { head: "사업자 등록번호",
              render: ({ business_code }) => (
                <Box width={'88%'}>  
                  <TextField
                    defaultValue={business_code}
                    multiline={false}
                    size={"small"}
                    placeholder={'사업자 등록번호'}
                    style={{ height: "25px",width:'200px' }}
                    onChange={(e) => setBusinessCode(e.target.value.trim())}
                  />
                </Box>
              )
            }
            :
            { head: "사업자 등록번호", key: "business_code" }
            ,
          ],
          [
            isModifyMode ? 
            { head: "전화번호",
              render: ({ telephone }) => (
                <Box width={'88%'}>  
                  <TextField
                    defaultValue={telephone}
                    multiline={false}
                    size={"small"}
                    type={'number'}
                    placeholder={'전화번호'}
                    style={{ height: "25px",width:'200px' }}
                    onChange={(e) => setTelephone(e.target.value.trim())}
                  />
                </Box>
              )
            }
            :
            { head: "전화번호", key: "telephone" },
            { head: "가입일자", render: ({ reg_date }) => dayjs(reg_date).format("YYYY-MM-DD") },
          ],
          isModifyMode ? 
          { head: "주소",
              render: ({ address }) => (
                <Box width={'88%'}>  
                  <TextField
                    defaultValue={address}
                    multiline={false}
                    size={"small"}
                    placeholder={'주소'}
                    style={{ height: "25px",width:'90%' }}
                    onChange={(e) => setAddress(e.target.value.trim())}
                  />
                </Box>
              )
            }
            :
          {
            head: "주소",
            render: ({ address }) => (
              <Typography variant="body2" whiteSpace="pre-line">
                {address}
              </Typography>
            ),
          },
        ];

        return <RowTable head={inner_head} headWidth={18} data={data} className={classes.inner_table} />;
      },
    },
    {
      head: "운영시간",
      key: "operation_time",
      render: ({ operation_time }) => operation_time || "-",
    },
    {
      head: "매장소개",
      key: "introduction",
      render: ({ introduction }) => introduction || "-",
    },
    // {
    //   head: "매장사진",
    //   key: "detail_img",
    //   render: ({ detail_img }) => (
    //     <Box display="flex">
    //       {detail_img?.map((img, index) => (
    //         <Box mr={2} display="flex" alignItems="center" key={index}>
    //           <ImageOutlined style={{ marginRight: "2px" }} />
    //           {` ${img.name}.${img.type} (${img.size / 1000000}KB)`}
    //         </Box>
    //       ))}
    //     </Box>
    //   ),
    // },
    {
      head: "계정상태",
      render: ({ agent_status,comform_date, is_agent_status_text }) => (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="700" style={{ color: agent_status === "reject" ? "red" : undefined }}>
            {is_agent_status_text}
            { ( agent_status === 'reject' || agent_status === 'approval' ) && 
              <Typography fontWeight="500">{dayjs(comform_date).format("YYYY-MM-DD")}</Typography>
            }
          </Typography>

          {agent_status === "request" ? 
            isModifyMode ?
            <Box display="flex">
              <Box display="flex" ml={2}>
                <Button mr={1} color="primary" onClick={() => setModifyMode(false)}>
                  수정취소
                </Button>
                <Button variant="outlined" color="primary" onClick={() => openModal("modify")}>
                  수정
                </Button>
              </Box>
            </Box>
            :
            <Box display="flex">
              <Button mr={1} color="primary" onClick={() => openModal("approve")}>
                승인
              </Button>
              <Button variant="outlined" color="primary" onClick={() => openModal("reject")}>
                거절
              </Button>
              <Box display="flex">
                <Button ml={2} color="secondary" onClick={() => openModify()}>
                  수정모드
                </Button>
              </Box>
            </Box>
          :
          isModifyMode ?
            <Box display="flex">
              <Button mr={1} color="secondary" onClick={() => setModifyMode(false)}>
                수정취소
              </Button>
              <Button variant="outlined" color="primary" onClick={() => openModal("modify")}>
                수정
              </Button>
            </Box>
            :
            <Box display="flex">
              <Button mr={1} color="primary" onClick={() => openModify()}>
                수정모드
              </Button>
            </Box>
          }
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Title>착한중개인 정보</Title>

      <Box my={2}>
        <RowTable head={table_head} data={dealer.data} />
      </Box>

      <ReplyList mt={8} mb={4} target_pk={member_pk} class_type="Agent" />

      <Grid container justify="flex-end">
        <Button width={150} py={1.5} mr={1} onClick={() => history.goBack()}>
          <Typography fontWeight="700">뒤로</Typography>
        </Button>
        <Button width={150} py={1.5} onClick={() => history.push("/member/dealer")}>
          <Typography fontWeight="700">처음으로</Typography>
        </Button>
        {dealer.data?.is_status !== "stop" && (
          <Button width={150} py={1.5} ml={1} onClick={() => openModal("delete")}>
            <Typography fontWeight="700">삭제</Typography>
          </Button>
        )}
      </Grid>

      <ConfirmModal
        title="회원정보를 수정하시겠습니다?"
        content={`이메일: ${dealer.data?.uid}
대표자명: ${reCeoName}
        `}
        action={() => updateDealer(
          { 
            member_pk,
            business_code: reBusinessCode,
            telephone: reTelephone,
            address: reAddress,
            area_code : dealer.data?.area_code,
            zipcode: dealer.data?.zipcode,
            name: reCeoName,
            company_name: reCompanyName
          }
        )}
        modalKey="modify"
      />
      <ConfirmModal
        title="해당 중개인을 회원가입 승인하시겠습니까?"
        content={`이메일: ${dealer.data?.uid}
대표자명: ${dealer.data?.name}
사업자명: ${dealer.data?.nickname}
`}
        action={() => approveDealer({ is_approval: true })}
        modalKey="approve"
      />
      <ConfirmModal
        title="해당 중개인을 회원가입 거절하시겠습니까?"
        content={`이메일: ${dealer.data?.uid}
대표자명: ${dealer.data?.name}
사업자명: ${dealer.data?.nickname}
`}
        isDestructive
        action={() => approveDealer({ is_approval: false ,rejectWord})}
        modalKey="reject"
        /*
        addButton={
          <TextField 
            id="reject_reason" 
            label="거절사유 입력" 
            style={{ width: "300px" }}
            onChange={(e) => setRejectWord(e.target.value.trim())}
            value={rejectWord}
          />
        }
        */
      />
      <ConfirmModal
        title="해당 중개인을 삭제하시겠습니까?"
        content={`이메일: ${dealer.data?.uid}
이름: ${dealer.data?.name}
닉네임: ${dealer.data?.nickname}
`}
        isDestructive
        action={removeDealer}
        modalKey="delete"
      />
    </Box>
  );
};