const express = require('express');
var AWS = require("aws-sdk");//아마존 웹 서비스를 이용하기 위한 변수
const server = express();
var requestIP = require('request-ip');
var fs = require('fs');

AWS.config.update({
  "region": "us-east-2",//지역설정, AWS계정과 같은 지역으로 설정했다.
  "endpoint": "secretPoint",//서버를 열 필요없이 바로 연결하기 위한 과정
  "accessKeyId": "secretID",//정책에 연결하기 위한 개인키
  "secretAccessKey": "secretPW"//정책에 연결하기 위한 비밀키
});//아마존 웹서비스의 설정 변경과정, 반드시 필요한 과정

var params ={};//연결하기 위한 변수
var temp;//얻어온 정보를 정리하기 위한 변수

var docClient = new AWS.DynamoDB.DocumentClient();//클라이언트를 사용하기 위한 변수

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  res = Math.random()*(max-min+1);
  res = Math.floor(res)+min;
  return res;
}//min, max 포함하는 랜덤함수
function base64_encode(file) {
  var img = fs.readFileSync(file)
  return Buffer(img).toString('base64');;
}
function waitASecond() {
  return new Promise(resolve => {
    setTimeout(() => resolve('run'), 1500);
  });
}
function waitAMiddle() {
  return new Promise(resolve => {
    setTimeout(() => resolve('run'), 3000);
  });
}
function waitALong() {
  return new Promise(resolve => {
    setTimeout(() => resolve('run'), 6000)
  });
}

//회원 정보 관련 기능
//1. 회원가입 //check out
server.get("/UserFunction/Register", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("register function is running");
    var str = { result : true } //결과값
    var checkId = false;
    try {
        let id = req.query.id;              //id
        let userName = req.query.userName;  //이름
        let password = req.query.password;  //비밀번호
        let averageScore = 0;               //평균점수 처음에는 0으로 초기화

        //DB에 위의 정보로 한 명 추가해줘
        //그리고 회차목록에 해당 id로 모든 회차 엔티티 추가해야 할거야. 무슨 말인지 이해 안되면 연락줘
        params = {//우선 아이디 중복을 확인하기 위한 준비
            TableName:"User",//table이름
            Key:{
                "id": id//키 속성 이름, 킷 값
            }
        };

        docClient.get(params, function(err1, data1) {//get으로 원하는 자료를 가져온다.
            if (err1) {
              throw err;
            } else {
              if (data1.Item == undefined) {//위의 작성문만 제대로 된다면 가져올 자료가 없다고 해도 오류가 뜨지 않는다.
                checkId = true;
                params = {//Use 테이블에 추가할 준비
                    TableName:"User",
                    Item:{//주의 추가할 땐 Item, 찾을 땐 Key.
                        "id": id,
                        "userName": userName,
                        "password": password,
                        "averageScore": averageScore
                    }
                };
                docClient.put(params, function(err2, data2) {//테이블 항목 추가
                    if (err2) {
                      //실패
                      throw err;
                    } else {
                      //성공
                      var num = 6;

                      for (var i = 0; i < 40; i++) {
                        params = {
                          TableName: "TestItem",
                          Item: {
                            "id": id,
                            "testNum": num + i,
                            "questNum": 0,
                            "score": 0
                          }
                        };
                        docClient.put(params, function (err3, data3) {
                          if (err3){
                            //여기서 오류 터지면 안됩니다.(성공 예제 확인)
                            throw err;
                          } else {
                            //성공
                          }
                        });
                      }
                      params = {
                        TableName: "RandomWait",
                        Item: {
                          "id": id,
                          "testNum": 0,
                          "questNum": 0
                        }
                      };
                      docClient.put(params, function (err3, data3) {
                        if(err3) {
                          //실패
                        } else {
                          //성공
                        }
                      });
                      params = {
                        TableName: "MyNoteWait",
                        Item: {
                          "id": id,
                          "testNum": 0,
                          "questNum": 0
                        }
                      };
                      docClient.put(params, function (err3, data3) {
                        if(err3) {
                          //실패
                        } else {
                          //성공
                        }
                      });
                      params = {
                        TableName: "WeakWait",
                        Item: {
                          "id": id,
                          "testNum": 0,
                          "questNum": 0
                        }
                      };
                      docClient.put(params, function (err3, data3) {
                        if(err3) {
                          //실패
                        } else {
                          //성공
                        }
                      });
                    }
                });
              } else {
                str = {result : false, errCode : 101};//존재하는 아이디
              }
            }
        });
        //그리고 만약 에러가 발생하면, 각 에러에 따라 밑의 주석 지워서 코드 추가하면 돼
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 102};
    }
    await waitASecond();
    console.log(str)
    console.log(str)
    console.log("결과출력");
    res.json(str)
})

//2. 로그인 //check out
server.get("/UserFunction/LogIn", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("login function is running");
    console.log("여기까지");
    var str = {result : true};
    var checkId = false;
    try {
        let id = req.query.id;
        let password = req.query.password;

        console.log(id + " " + password)
        //DB에 위의 아이디가 있는지, 혹은 비밀번호가 맞지 않는지 검사
        //존재하지 않는 아이디
        //str = {result : false, errCode : 101}
        params = {
          TableName:"User",
          Key:{
            "id":id
          }
        };
        console.log("여기까지");

        docClient.get(params, function(err, data) {
            if (err) {
              //실패
              console.log("여기까지2");
              console.log(err)
              throw err;
            } else {
              //성공
              
              console.log("여기까지3");
              if (data.Item == undefined) {//해당 아이디가 없다.
                console.log(data)
                console.log(data.Item)
                console.log("여기까지4");
                str = {result : false, errCode : 101};
              } else {//아이디가 있는 것을 확인
                //비밀번호 오류
                //str = {result : false, errCode : 102}
                console.log("여기까지5");
                params = {
                  TableName:"User",
                  Key:{
                    "id":id//,
                    //"password":password
                  }
                };
                docClient.get(params, function(err, data) {
                  if (err) {
                    //실패
                    console.log(err)
                    throw err;
                  } else {
                    //성공
                    if (data.Item == undefined) {
                      str = {result : false, errCode : 102};//비밀번호가 없는 것을 확인
                    } else {
                      //성공
                      str = {
                        result : true,
                        name: data.Item.userName
                      };
                      console.log(str)
                    }
                  }
                });
              }
            }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 103}
    }
    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str)
})

//3. 회원정보 수정 //check out
server.get("/UserFunction/EditInfo", async(req,res) => {
  console.log(requestIP.getClientIp(req));
    console.log("editinfo function is running");
    var str = {result : true}
    try {
        let id = req.query.id;              //id
        let userName = req.query.userName;  //이름
        let password = req.query.password;  //원래 비밀번호
        let newPassword = req.query.newPassword; //새로운 비밀번호

        //DB에서 해당 정보 수정
        params = {
          TableName: "User",
          Key: {
            "id": id
          },
          UpdateExpression: "set password = :np, userName = :un",
          ConditionExpression: "password = :p",
          ExpressionAttributeValues:{
            ":np": newPassword,
            ":p": password,
            ":un": userName
          },
          returnValues: "UPDATE_NEW"
        }

        console.log(params)

        docClient.update(params, function(err, data) {
          if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            str = {result : false, errCode : 101};
          } else {
            //성공
          }
        });
        //원래 비밀번호가 맞지 않을 경우
        //str = {result : false, errCode : 101}
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 102}
    }

    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str)
})

//4. 회원탈퇴 // check out
server.get("/UserFunction/UnRegister", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("unregister function is running");
    var str = {result : true}
    try {
        let id = req.query.id;              //id
        let password = req.query.password;  //비밀번호
        //DB에서 해당 사용자 정보 삭제
        params = {
          TableName: "User",
          Key: {
              "id": id
          },
          ConditionExpression: "password = :p",
          ExpressionAttributeValues: {
              ":p": password
          }
      };
      docClient.delete(params, function (err, data) {
          if (err) {
              str = { result: false, errCode: 101 };//요건 실패하면 조건에 부합하는 거 없다고 뜹니다!
          } else {
              //삭제 성공
              params = {
                  TableName: "MyNote",
                  Key: {
                      "id": id
                  }
              };
              docClient.delete(params, function (err1, data1) {
                  if (err1) {
                      //실패
                  } else {
                      //성공
                  }
              });
              params = {
                  TableName: "MyNoteWait",
                  Key: {
                      "id": id
                  }
              };
              docClient.delete(params, function (err1, data1) {
                  if (err1) {
                      //실패
                  } else {
                      //성공
                  }
              });
              params = {
                  TableName: "RandomWait",
                  Key: {
                      "id": id
                  }
              };
              docClient.delete(params, function (err1, data1) {
                  if (err1) {
                      //실패
                  } else {
                      //성공
                  }
              });
              params = {
                  TableName: "TestItem",
                  KeyConditionExpression: "id = :id",
                  ExpressionAttributeValues: {
                      ":id": id
                  }
              };
              docClient.query(params, function (err1, data1) {
                  if (err1) {
                      //실패
                  } else {
                      //성공
                      data1.Items.forEach(function (item) {
                          params = {
                              TableName: "TestItem",
                              Key: {
                                  "id": id,
                                  "testNum": item.testNum
                              }
                          };
                          docClient.delete(params, function (err2, data2) {
                              if(err2){
                                  //실패
                              } else {
                                  //성공
                                  console.log("success to delete TestItem");
                              }
                          });
                      });
                  }
              });
              for(var i = 6; i <= 45; i++) {
                  params = {
                      TableName: "TestWrongAnswer",
                      KeyConditionExpression: "#it = :it",
                      ExpressionAttributeNames:{
                          "#it": "id/test"
                      },
                      ExpressionAttributeValues: {
                          ":it": id + '/' + i
                      }
                  };
                  docClient.query(params, function (err1, data1) {
                      if (err1) {
                          console.error("Unable to query. Error:", JSON.stringify(err1, null, 2));
                      } else {
                          //성공
                          data1.Items.forEach(function (item) {
                              params = {
                                  TableName: "TestWrongAnswer",
                                  Key: {
                                      "id/test": id + '/' + i,
                                      "quest": item.quest
                                  }
                              };
                              docClient.delete(params, function (err2, data2) {
                                  if(err2){
                                      //실패
                                  } else {
                                      //성공
                                      console.log("success to delete TestWrongAnswer");
                                  }
                              })
                          });
                      }
                  });
              }
              
              params = {
                  TableName: "MyNote",
                  KeyConditionExpression: "id = :i",
                  ExpressionAttributeValues: {
                      ":i": id
                  }
              };
              docClient.query(params, function (err1, data1) {
                  if (err1) {
                      //실패
                  } else {
                      //성공
                      data1.Items.forEach(function (item) {
                          params = {
                              TableName: "MyNote",
                              Key: {
                                  "id": id,
                                  "testQuest": item.testQuest
                              }
                          };
                          docClient.delete(params, function(err2, data) {
                              if(err2) {
                                  //실패
                              } else {
                                  //성공
                                  console.log("success to delete MyNote");
                              }
                          })
                      });
                  }
              });
          }
      });
        //비밀번호가 일치하지 않을 경우
        //str = {result : false, errCode : 101}
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 102}
    }

    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//문제풀기 기능
//5. 회차리스트 로딩 // json array로 전송하는 지 질문
server.get("/DoTest/LoadTestList", async(req,res) => {
    console.log(requestIP.getClientIp(req));  
    console.log("loadtestlist function is running");
    var str = {result : true}
    try {
        let id = req.query.id;              //id
        //DB에서 해당 id로 회차목록 전체 조회
        params = {
          TableName: "TestItem",
          KeyConditionExpression: "id = :i",
          ExpressionAttributeValues: {
            ":i": id
          }
        }

        docClient.query(params, function (err, data) {
            if (err) {
              //실패
              throw err
            } else {
              var score = 0
              var num = 0
              item = data.Items
              data.Items.forEach(item => {
                if(item.questNum == 51) {
                  score = score + item.score
                  num++
                }
              });
              if(num == 0) score = 0
              else score = score/num
                str = {
                  result : true,
                  score : score,
                  items : data.Items
                }
            }
        });
        //회원가입에도 명시했는데, 회원가입할 때 다 만들어져 있어야해.
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 101}
    }

    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//6. 회차별 문제풀이-1(시작)
server.get("/DoTest/StartTestByNum", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("startTestByNum function is running");
    var str;
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum*1     //시험 회차
        //DB에서 해당 id와 회차에서 문제번호(중간종료여부) 검색
        params = {
          TableName: "TestItem",
          Key: {
            "id": id,
            "testNum": testNum,
          }
        };
        console.log(params)
        //그런데 만약 문제번호가 51(이미 종료)일 경우에는

        docClient.get(params, function (err1, data1) {
          if (err1) {
            //실패시
            console.log(333)
            throw err1
          } else {
            //성공시
            console.log(data1)
            if(data1.Item.questNum == 51) {
            //문제번호를 0으로 바꾸고
              params = {
                TableName: "TestItem",
                Key: {
                  "id": id,
                  "testNum": testNum
                },
                UpdateExpression: "set questNum = :q",
                ConditionExpression: "id = :i and testNum = :t",
                ExpressionAttributeValues: {
                  ":q": 0,
                  ":i": id,
                  ":t": testNum
                },
                ReturnValues:"UPDATED_NEW"
              };
              console.log('zzzzzz')
              console.log(params)

              docClient.update(params, function (err2, data2) {
                if (err2) {
                  //실패
                  console.log(222)
                  throw err2
                } else {
                //성공
                //0이면 1번, 아니면 해당 문제번호 뽑아와
                params ={
                  TableName: "Quest",
                  Key: {
                    testNum: testNum,
                    questNum: 1
                  }
                };
                console.log('zzzzzz')
                console.log(params)

                docClient.get(params, function(err3, data3) {
                  if (err3) {
                    console.log(111)
                    throw err3
                  } else {
                    temp = data3.Item;
                    var questionNum = 1;
                    var question = temp.quest;       //문제
                    var score = temp.score;          //점수
                    var questType1 = temp.type1;     //문제 타입 ex)조선-역사
                    var questType2 = temp.type2;     //문제 타입2 없으면 ""
                    var isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                    var answer1 = temp.answer1;        //지문 1~5
                    var answer2 = temp.answer2;
                    var answer3 = temp.answer3;
                    var answer4 = temp.answer4;
                    var answer5 = temp.answer5;
                    var answer = temp.answer;         //정답
                    var comment = temp.comment;        //해설

                    
                    var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                    image = base64_encode(filePath)
                    if(answer1 == '(사진)' || answer1 == '(그림)') {
                      answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                      answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                      answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                      answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                      answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                    }

                    str = {
                        result : true,

                        testNum : testNum,
                        questionNum : questionNum,
                        question : question,
                        score : score,
                        image : image,
                        questType1 : questType1,
                        questType2 : questType2,
                        isImageQuest : isImageQuest,
                        answer1 : answer1,
                        answer2 : answer2,
                        answer3 : answer3,
                        answer4 : answer4,
                        answer5 : answer5,
                        answer : answer,
                        comment : comment
                    }
                    
                  console.log('zzz2')
                  console.log(str)
                  }
                });
                }
              });
              //오답 테이블 지우기
              params = {
                TableName: "TestWrongAnswer",
                KeyConditionExpression: "#it = :it",
                ExpressionAttributeNames: {
                  "#it": "id/test"
                },
                ExpressionAttributeValues: {
                  ":it": id + '/' + testNum
                }
              };
              
              docClient.query(params, function(err2, data2) {
                  if (err2) {
                    //실패        
                  console.log(555)
                  } else {
                    //성공
                    data2.Items.forEach(function (item){
                      params = {
                        TableName: "TestWrongAnswer",
                        Key: {
                          "id/test": id + '/' + testNum,
                          "quest": item.quest
                        }
                      }
                      docClient.delete(params, function (err3, data3){
                        if(err3){
                          //실패
                        } else {
                          //성공
                          console.log("success to delete");
                        }
                      });
                    });
                  }
              });
            } else  if (data1.Item.questNum == 0) {//문제 번호가 0일때
              //이거 위에서 실행한거 한번 더
              //0이면 1번, 아니면 해당 문제번호 뽑아와
              params ={
                TableName: "Quest",
                Key: {
                  testNum: testNum,
                  questNum: 1
                }
              };

              docClient.get(params, function(err2, data2) {
                if (err2) {
                  console.log(444)
                  throw err2
                } else {
                  temp = data2.Item;
                  var questionNum = 1;
                  var question = temp.quest;       //문제
                  var score = temp.score;          //점수
                  var image = temp.image;          //문제 이미지
                  var questType1 = temp.type1;     //문제 타입 ex)조선-역사
                  var questType2 = temp.type2;     //문제 타입2 없으면 ""
                  var isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                  var answer1 = temp.answer1;        //지문 1~5
                  var answer2 = temp.answer2;
                  var answer3 = temp.answer3;
                  var answer4 = temp.answer4;
                  var answer5 = temp.answer5;
                  var answer = temp.answer;         //정답
                  var comment = temp.comment;        //해설

                  var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                  image = base64_encode(filePath)
                  if(answer1 == '(사진)' || answer1 == '(그림)') {
                    answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                    answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                    answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                    answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                    answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                  }

                  str = {
                      result : true,

                      testNum : testNum,
                      questionNum : questionNum,
                      question : question,
                      score : score,
                      image : image,
                      questType1 : questType1,
                      questType2 : questType2,
                      isImageQuest : isImageQuest,
                      answer1 : answer1,
                      answer2 : answer2,
                      answer3 : answer3,
                      answer4 : answer4,
                      answer5 : answer5,
                      answer : answer,
                      comment : comment
                  }
                  console.log('zzz')
                  console.log(str)
                }
              });
                //오답 테이블 지우기
                params = {
                  TableName: "TestWrongAnswer",
                  KeyConditionExpression: "#it = :it",
                  ExpressionAttributeNames: {
                    "#it": "id/test"
                  },
                  ExpressionAttributeValues: {
                    ":it": id + '/' + testNum
                  }
                };
                
                docClient.query(params, function(err2, data2) {
                    if (err2) {
                      //실패        
                    console.log(555)
                    } else {
                      //성공
                      data2.Items.forEach(function (item){
                        params = {
                          TableName: "TestWrongAnswer",
                          Key: {
                            "id/test": id + '/' + testNum,
                            "quest": item.quest
                          }
                        }
                        docClient.delete(params, function (err3, data3){
                          if(err3){
                            //실패
                          } else {
                            //성공
                            console.log("success to delete");
                          }
                        });
                      });
                    }
                });
            } else { //0번도 51번도 아닐 때
              params ={
                TableName: "Quest",
                Key: {
                  testNum: testNum,
                  questNum: data1.Item.questNum
                }
              };

              docClient.get(params, function(err2, data2) {
                if (err2) {
                  console.log(444)
                  throw err2
                } else {
                  temp = data2.Item;
                  var questionNum = temp.questNum;
                  var question = temp.quest;       //문제
                  var score = temp.score;          //점수
                  var image = temp.image;          //문제 이미지
                  var questType1 = temp.type1;     //문제 타입 ex)조선-역사
                  var questType2 = temp.type2;     //문제 타입2 없으면 ""
                  var isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                  var answer1 = temp.answer1;        //지문 1~5
                  var answer2 = temp.answer2;
                  var answer3 = temp.answer3;
                  var answer4 = temp.answer4;
                  var answer5 = temp.answer5;
                  var answer = temp.answer;         //정답
                  var comment = temp.comment;        //해설

                  var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                  image = base64_encode(filePath)
                  if(answer1 == '(사진)' || answer1 == '(그림)') {
                    answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                    answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                    answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                    answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                    answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                  }

                  str = {
                      result : true,

                      testNum : testNum,
                      questionNum : questionNum,
                      question : question,
                      score : score,
                      image : image,
                      questType1 : questType1,
                      questType2 : questType2,
                      isImageQuest : isImageQuest,
                      answer1 : answer1,
                      answer2 : answer2,
                      answer3 : answer3,
                      answer4 : answer4,
                      answer5 : answer5,
                      answer : answer,
                      comment : comment
                  }
                  console.log('zzz')
                  console.log(str)
                }
              });
            }
          }
        });
        //회차별 오답 테이블 삭제해버려
        //51에서 시작하면 0으로 바꾸고, 0일 땐 1을 불러오고
        
        //무슨 말인지 알지?

        //이거 다음 문제 엔티티에서 뽑아올 준비
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 101}
    }

    await waitAMiddle();
    console.log('ajwld');
    console.log(str)
    console.log('ajwld');
    console.log("결과출력");
    res.json(str);
})

//7. 회차별 문제풀이-2(계속)//정리(?)끝
server.get("/DoTest/ContinueTestByNum", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("continueTestByNum function is running");
    var str;
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum*1     //시험 회차
        let questNum = req.query.questNum*1   //문제 번호
        let userAnswer = req.query.answer*1   //정답

        let realAnswer; //진짜 정답
        let questScore;      //점수
        let type1;
        let type2;

        var questionNum;    //문제번호
        var question;       //문제
        var score;          //점수
        var image;          //문제 이미지
        var questType1;     //문제 타입 ex)조선-역사
        var questType2;     //문제 타입2 없으면 ""
        var isImageQuest;   //이미지 문제인지 여부. 맞으면 true
        var answer1;        //지문 1~5
        var answer2;
        var answer3;
        var answer4;
        var answer5;
        var answer;         //정답
        var comment;        //해설

        //DB에서 해당 testNum과 questNum이 일치하는 데이터를 찾아서
        //점수와 진짜 정답 가져오기
        params = {
          TableName: "Quest",
          Key: {
            testNum: testNum,
            questNum: questNum
          }
        };

        docClient.get(params, function (err1, data1) {
          if (err1) {
            console.log(111)
            console.log(err1)
            throw err1
          } else {
            console.log(data1)
            realAnswer = data1.Item.answer;
            questScore = data1.Item.score;
            type1 = data1.Item.type1;
            if (data1.Item.type2 != undefined) {
              type2 = data1.Item.type2;
            }
            if(userAnswer == realAnswer) {//맞췄을 때

              //score만큼 해당 아이디의 회차 점수에 추가하기
              //ex) 기존 10, 해당 문제 점수 3 => 13으로 갱신
              params = {
                TableName: "TestItem",
                Key: {
                  "id": id,
                  "testNum": testNum
                },
                UpdateExpression: "set score = score + :s",
                ExpressionAttributeValues: {
                  ":s" : questScore
                }
              };

              docClient.update(params, function (err2, data2) {
                if (err2) {
                  //실패
            console.log(222)
                  console.log(err2)
                  throw err2
                } else {
                  //성공
                  //취약점 분석에 푼 갯수, 맞은 갯수 추가하기.
                  params = {
                    TableName: "Weakness",
                    Key: {
                      "id": id,
                      "type": type1
                    },
                    UpdateExpression: "set solve = solve + :s, correct = correct + :c",
                    ExpressionAttributeValues: {
                      ":s": 1,
                      ":c": 1
                    }
                  }
                  console.log(params)

                  docClient.update(params, function (err3, date3) {
                    if (err3) {
                      //실패
            console.log(333)
                      console.log(err3)
                      throw err3
                    } else {
                      //성공
                      if(type2 != undefined) {//맞았을 때 타입2가 존재한다면
                        params = {
                          TableName: "Weakness",
                          Key: {
                            "id": id,
                            "type": type2
                          },
                          UpdateExpression: "set solve = solve + :s, correct = correct + :c",
                          ExpressionAttributeValues: {
                            ":s": 1,
                            ":c": 1
                          }
                        }

                        docClient.update(params, function (err4, date4) {
                          if (err4) {
                            //실패
            console.log(444)
                            console.log(err4)
                            throw err4
                          } else {
                            //성공
                            //파라미터로 입력받은 questNum의 다음 문제 뽑아와.
                            //만약 questNum이 10이면, 11번 문제 뽑아오면 돼
                            params = {
                              TableName: "Quest",
                              Key: {
                                testNum: testNum,
                                questNum: questNum + 1
                              }
                            };

                            docClient.get(params, function (err5, data5) {//문제 뽑아오기
                              if (err5) {
                                //실패
            console.log(555)
                                console.log(err5)
                                throw err5
                              } else {
                                //성공
                                temp = data5.Item;
                                questionNum = temp.questNum;    //문제번호
                                question = temp.quest;       //문제
                                score = temp.score;          //점수
                                image = temp.image;          //문제 이미지
                                questType1 = temp.type1;     //문제 타입 ex)조선-역사
                                questType2 = temp.type2;     //문제 타입2 없으면 ""
                                isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                                answer1 = temp.answer1;        //지문 1~5
                                answer2 = temp.answer2;
                                answer3 = temp.answer3;
                                answer4 = temp.answer4;
                                answer5 = temp.answer5;
                                answer = temp.answer;         //정답
                                comment = temp.comment;        //해설

                                var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                                image = base64_encode(filePath)
                                if(answer1 == '(사진)' || answer1 == '(그림)') {
                                  answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                                  answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                                  answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                                  answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                                  answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                                }

                                str = {
                                    result : true,

                                    testNum : testNum,
                                    questionNum : questionNum,
                                    question : question,
                                    score : score,
                                    image : image,
                                    questType1 : type1,
                                    questType2 : type2,
                                    isImageQuest : isImageQuest,
                                    answer1 : answer1,
                                    answer2 : answer2,
                                    answer3 : answer3,
                                    answer4 : answer4,
                                    answer5 : answer5,
                                    answer : answer,
                                    comment : comment
                                }
                              }
                            });
                          }
                        });
                      } else { //type2가 없을 떼
                        //파라미터로 입력받은 questNum의 다음 문제 뽑아와.
                        //만약 questNum이 10이면, 11번 문제 뽑아오면 돼
                        params = {
                          TableName: "Quest",
                          Key: {
                            testNum: testNum,
                            questNum: questNum + 1
                          }
                        };

                        docClient.get(params, function (err4, data4) {//문제 뽑아오기
                          if (err4) {
                            //실패
                            throw err4
                          } else {
                            //성공
                            temp = data4.Item;
                            questionNum = temp.questNum;    //문제번호
                            question = temp.quest;       //문제
                            score = temp.score;          //점수
                            image = temp.image;          //문제 이미지
                            questType1 = temp.type1;     //문제 타입 ex)조선-역사
                            questType2 = temp.type2;     //문제 타입2 없으면 ""
                            isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                            answer1 = temp.answer1;        //지문 1~5
                            answer2 = temp.answer2;
                            answer3 = temp.answer3;
                            answer4 = temp.answer4;
                            answer5 = temp.answer5;
                            answer = temp.answer;         //정답
                            comment = temp.comment;        //해설

                            var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                            image = base64_encode(filePath)
                            if(answer1 == '(사진)' || answer1 == '(그림)') {
                              answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                              answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                              answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                              answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                              answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                            }

                            str = {
                                result : true,

                                testNum : testNum,
                                questionNum : questionNum,
                                question : question,
                                score : score,
                                image : image,
                                questType1 : type1,
                                questType2 : type2,
                                isImageQuest : isImageQuest,
                                answer1 : answer1,
                                answer2 : answer2,
                                answer3 : answer3,
                                answer4 : answer4,
                                answer5 : answer5,
                                answer : answer,
                                comment : comment
                            }
                          }
                        });
                      }
                    }
                  });
                }
              });
            } else { //못맞췄을 때
              //회차별 오답 리스트에 해당 문제 추가하기
              params = {
                TableName: "TestWrongAnswer",
                Item: {
                  "id/test": id+'/'+testNum,
                  "quest": questNum,
                  "select": userAnswer
                }
              };

              docClient.put(params, function (err2, data2) {
                if (err2) {
                  //실패
                  throw err2
                } else {
                  //성공
                  //취약점 분석에 푼 갯수만 추가하기.
                  params = {
                    TableName: "Weakness",
                    Key: {
                      "id": id,
                      "type": type1
                    },
                    UpdateExpression: "set solve = solve + :s",
                    ExpressionAttributeValues: {
                      ":s": 1
                    }
                  }

                  docClient.update(params, function (err3, date3) {
                    if (err3) {
                      //실패
                      throw err3
                    } else {
                      //성공
                      if(type2 != undefined) {//틀렸을시에 타입이 2가지 존재할 때
                        params = {
                          TableName: "Weakness",
                          Key: {
                            "id": id,
                            "type": type2
                          },
                          UpdateExpression: "set solve = solve + :s",
                          ExpressionAttributeValues: {
                            ":s": 1
                          }
                        }

                        docClient.update(params, function (err4, date4) {
                          if (err4) {
                            //실패
                            throw err4
                          } else {
                            //성공
                            //파라미터로 입력받은 questNum의 다음 문제 뽑아와.
                            //만약 questNum이 10이면, 11번 문제 뽑아오면 돼
                            params = {
                              TableName: "Quest",
                              Key: {
                                testNum: testNum,
                                questNum: questNum + 1
                              }
                            };

                            docClient.get(params, function (err5, data5) {//문제 뽑아오기
                              if (err5) {
                                //실패
                                throw err5
                              } else {
                                //성공
                                temp = data5.Item;
                                questionNum = temp.questNum;    //문제번호
                                question = temp.quest;       //문제
                                score = temp.score;          //점수
                                image = temp.image;          //문제 이미지
                                questType1 = temp.type1;     //문제 타입 ex)조선-역사
                                questType2 = temp.type2;     //문제 타입2 없으면 ""
                                isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                                answer1 = temp.answer1;        //지문 1~5
                                answer2 = temp.answer2;
                                answer3 = temp.answer3;
                                answer4 = temp.answer4;
                                answer5 = temp.answer5;
                                answer = temp.answer;         //정답
                                comment = temp.comment;        //해설

                                var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                                image = base64_encode(filePath)
                                if(answer1 == '(사진)' || answer1 == '(그림)') {
                                  answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                                  answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                                  answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                                  answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                                  answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                                }

                                str = {
                                    result : true,

                                    testNum : testNum,
                                    questionNum : questionNum,
                                    question : question,
                                    score : score,
                                    image : image,
                                    questType1 : type1,
                                    questType2 : type2,
                                    isImageQuest : isImageQuest,
                                    answer1 : answer1,
                                    answer2 : answer2,
                                    answer3 : answer3,
                                    answer4 : answer4,
                                    answer5 : answer5,
                                    answer : answer,
                                    comment : comment
                                }
                              }
                            });
                          }
                        });
                      } else { //type2가 없을 때
                        //파라미터로 입력받은 questNum의 다음 문제 뽑아와.
                        //만약 questNum이 10이면, 11번 문제 뽑아오면 돼
                        params = {
                          TableName: "Quest",
                          Key: {
                            testNum: testNum,
                            questNum: questNum + 1
                          }
                        };

                        docClient.get(params, function (err4, data4) {//문제 뽑아오기
                          if (err4) {
                            //실패
                            throw err4
                          } else {
                            //성공
                            temp = data4.Item;
                            questionNum = temp.questNum;    //문제번호
                            question = temp.quest;       //문제
                            score = temp.score;          //점수
                            image = temp.image;          //문제 이미지
                            questType1 = temp.type1;     //문제 타입 ex)조선-역사
                            questType2 = temp.type2;     //문제 타입2 없으면 ""
                            isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                            answer1 = temp.answer1;        //지문 1~5
                            answer2 = temp.answer2;
                            answer3 = temp.answer3;
                            answer4 = temp.answer4;
                            answer5 = temp.answer5;
                            answer = temp.answer;         //정답
                            comment = temp.comment;        //해설

                            var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                            image = base64_encode(filePath)
                            if(answer1 == '(사진)' || answer1 == '(그림)') {
                              answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                              answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                              answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                              answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                              answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                            }

                            str = {
                                result : true,

                                testNum : testNum,
                                questionNum : questionNum,
                                question : question,
                                score : score,
                                image : image,
                                questType1 : type1,
                                questType2 : type2,
                                isImageQuest : isImageQuest,
                                answer1 : answer1,
                                answer2 : answer2,
                                answer3 : answer3,
                                answer4 : answer4,
                                answer5 : answer5,
                                answer : answer,
                                comment : comment
                            }
                          }
                        });
                      }
                    }
                  });
                }
              });
            }
          }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 101}
    }

    await waitAMiddle();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//8. 회차별 문제풀이-3(최종종료)// 문제 불러오기 개량 필요 //그냥 빠르게 여러번 불러와서(동기화 없이) 정렬 ㄱㄱ 끝
server.get("/DoTest/FinishTestByNum",async(req, res) => {
  console.log("finishTestByNum function is running");
  var str;
  try {
    let id = req.query.id;              //id  //50?
    let testNum = req.query.testNum * 1;     //시험 회차
    let questNum = req.query.questNum * 1;   //문제 번호
    let userAnswer = req.query.answer * 1;   //정답

    var slot; //오답 1문제씩 담을 칸

    //얘네는 다 오답임
    var questionNum;    //문제번호
    var question;       //문제
    var score;          //점수
    var image;          //문제 이미지
    var questType1;     //문제 타입 ex)조선-역사
    var questType2;     //문제 타입2 없으면 ""
    var isImageQuest;   //이미지 문제인지 여부. 맞으면 true
    var answer1;        //지문 1~5
    var answer2;
    var answer3;
    var answer4;
    var answer5;
    var answer;         //정답
    var comment;        //해설

    var average = 0;//평균을 남기기 위한 변수
    var num = 0;//평균을 남기기 위한 변수

    //DB에서 해당 testNum과 questNum이 일치하는 데이터를 찾아서
    //점수와 진짜 정답 가져오기
    let realAnswer; //진짜 정답
    let questScore;      //점수

    var type1;          //type1을 담을 변수
    var type2;          //type2를 담을 변수
    var finalScore;

    function customSort(a, b) {
      if (a.questionNum == b.questionNum) {
        return 0
      }
      return a.questionNum > b.questionNum ? 1 : -1;
    }

    console.log(questNum + "./." + testNum)

    params = {
      TableName: "Quest",
      Key: {
        "testNum": testNum,
        "questNum": questNum
      }
    };
    console.log(params)

    docClient.get(params, function (err1, data1) {
      console.log(data1)
      if (err1) {
        console.log(111);
        console.error("Unable to query1. Error:", JSON.stringify(err1, null, 2));
      } else {
        realAnswer = data1.Item.answer;
        questScore = data1.Item.score;
        type1 = data1.Item.type1;
        console.log(type1);
        if (data1.Item.type2 != undefined) {
          type2 = data1.Item.type2;
        }
        if (userAnswer == realAnswer) {//맞았을 때
          //score만큼 해당 아이디의 회차 점수에 추가하기
          //ex) 기존 10, 해당 문제 점수 3 => 13으로 갱신
          //이거 중간 종료도 없고 필요할 것 같아서 문제 51번으로 바꿔줬습니다.
          params = {
            TableName: "TestItem",
            Key: {
              "id": id,
              "testNum": testNum
            },
            UpdateExpression: "set score = score + :s, questNum = :q",
            ExpressionAttributeValues: {
              ":s": questScore,
              ":q": 51
            }
          };
          console.log(id);
          console.log(testNum);
          docClient.update(params, function (err2, data2) {
            if (err2) {
              //실패
          console.log(222);
              console.error("Unable to query2. Error:", JSON.stringify(err2, null, 2));
            } else {
              //성공
              //type1에 대한 weakness 수정
              params = {
                TableName: "Weakness",
                Key: {
                  "id": id,
                  "type": type1
                },
                UpdateExpression: "set solve = solve + :s, correct = correct + :c",
                ExpressionAttributeValues: {
                  ":s": 1,
                  ":c": 1
                }
              };

              docClient.update(params, function (err3, data3) {
                if (err3) {
                  //실패
              console.log(333)
                  console.error("Unable to query3. Error:", JSON.stringify(err3, null, 2));
                } else {
                  //성공
                  if (type2 != undefined) {//타입 2 가 있을 경우
                    //type2 에 대한 weakness 수정
                    params = {
                      TableName: "Weakness",
                      Key: {
                        "id": id,
                        "type": type2
                      },
                      UpdateExpression: "set solve = solve + :s, correct = correct + :c",
                      ExpressionAttributeValues: {
                        ":s": 1,
                        ":c": 1
                      }
                    };

                    docClient.update(params, function (err4, data4) {
                      if (err4) {
                        //실패
    console.log(444);
                        console.error("Unable to query4. Error:", JSON.stringify(err4, null, 2));
                      } else {
                        //성공
                        //회차에서 시험을 끝낸 회차만을 가져온다.
                        params = {
                          TableName: "TestItem",
                          FilterExpression: "id = :i and questNum = :q",
                          ExpressionAttributeValues: {
                            ":i": id,
                            ":q": 51
                          }
                        };

                        docClient.scan(params, function (err5, data5) {
                          if (err5) {
                            console.log(555);
                            //실패;
                            console.error("Unable to query5. Error:", JSON.stringify(err5, null, 2));
                          } else {
                            //성공
                            //평균을 구한다.
                            //ㅇㅁㅇ : 맞는지 모르겠네
                            data5.Items.forEach(item => {
                              if (testNum == item.testNum) {
                                finalScore = item.score;
                              }
                              average = average + item.score;
                              num++;
                            });
                            average = average / num;
                            //User테이블의 평균점수 개정
                            params = {
                              TableName: "User",
                              Key: {
                                "id": id
                              },
                              UpdateExpression: "set averageScore = :as",
                              ExpressionAttributeValues: {
                                ":as": average
                              }
                            };

                            docClient.update(params, function (err6, data6) {
                              if (err6) {
                                //실패
                                console.error("Unable to query6. Error:", JSON.stringify(err6, null, 2));
                              } else {
                                //성공
                              }
                            });
                          }
                        });

                        //틀린 문제 다 가져오기
                        params = {
                          TableName: "TestWrongAnswer",
                          FilterExpression: "#it = :it",
                          ExpressionAttributeNames: {
                            "#it": "id/test"
                          },
                          ExpressionAttributeValues: {
                            ":it": id + '/' + testNum
                          }
                        };

                        docClient.scan(params, function (err5, data5) {
                          if (err5) {
                            //실패
    console.log(666);
                            console.error("Unable to query7. Error:", JSON.stringify(err5, null, 2));
                          } else {
                            //성공
                            //data6.Items.quest를 이용해 forEach로 "Quest"에서 문제 가오기
                            temp = [];
                            //ㅇㅁㅇ
                            data5.Items.forEach(item => {
                              params = {
                                TableName: "Quest",
                                Key: {
                                  "testNum": testNum,
                                  "questNum": item.quest
                                }
                              };
                              docClient.get(params, function (err6, data6) {
                                if (err6) {
                                  //실패;
    console.log(7777);
                                  console.error("Unable to query8. Error:", JSON.stringify(err6, null, 2));
                                } else {
                                  //성공
                                  answer1 = data6.Item.answer1
                                  answer2 = data6.Item.answer2
                                  answer3 = data6.Item.answer3
                                  answer4 = data6.Item.answer4
                                  answer5 = data6.Item.answer5
                                  var filePath = "한국사/" + testNum + "회/" + data6.Item.questNum + ".jpg";
                                  image = base64_encode(filePath)
                                  if(data6.Item.answer1 == '(사진)') {
                                    answer1 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-1.jpg")
                                    answer2 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-2.jpg")
                                    answer3 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-3.jpg")
                                    answer4 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-4.jpg")
                                    answer5 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-5.jpg")
                                  }
                                  console.log('변환완료' + filePath)

                                  slot = {
                                    questionNum: data6.Item.questNum,    //문제번호
                                    question: data6.Item.quest,       //문제
                                    score: data6.Item.score,          //점수
                                    image: image,          //문제 이미지
                                    questType1: data6.Item.type1,     //문제 타입 ex)조선-역사
                                    questType2: data6.Item.type2,     //문제 타입2 없으면 ""
                                    isImageQuest: data6.Item.isImageQuest,   //이미지 문제인지 여부. 맞으면 true
                                    answer1: answer1,        //지문 1~5
                                    answer2: answer2,
                                    answer3: answer3,
                                    answer4: answer4,
                                    answer5: answer5,
                                    answer: data6.Item.answer,         //정답
                                    comment: data6.Item.comment        //해설
                                  }
                                  console.log('넣기 완료')
                                  temp.push(slot);
                                  //console.log(slot);//여기입니다. 여기선 잘나옵니다.
                                }
                              });
                            })
                            //문제를 뽑아오는 것보다 정렬을 먼저 해버립니다.
                            console.log(temp);
                            str = {
                              result: true,
                              finalScore: finalScore,
                              wrongQuestions: temp
                            }
                          }
                        });
                      }
                    });
                  } else { //타입 2 가 없을 경우
                    //일단 평균내는 것 부터 시작하자
                    params = {
                      TableName: "TestItem",
                      FilterExpression: "id = :i and questNum = :q",
                      ExpressionAttributeValues: {
                        ":i": id,
                        ":q": 51
                      }
                    };

                    docClient.scan(params, function (err4, data4) {
                      if (err4) {
                        //실패
    console.log(888);
                        console.error("Unable to query9. Error:", JSON.stringify(err4, null, 2));
                      } else {
                        //성공
                        //평균을 구한다.
                        data4.Items.forEach(item => {
                          if (testNum == item.testNum) {
                            finalScore = item.score;
                          }
                          average = average + item.score;
                          num++;
                        })
                        average = average / num;
                        //User의 평균 점수 수정
                        params = {
                          TableName: "User",
                          Key: {
                            "id": id
                          },
                          UpdateExpression: "set averageScore = :as",
                          ExpressionAttributeValues: {
                            ":as": average
                          }
                        };

                        docClient.update(params, function (err5, data5) {
                          if (err5) {
                            //실패
    console.log(999);
                            console.error("Unable to query10. Error:", JSON.stringify(err5, null, 2));
                          } else {
                            //성공
                          }
                        });
                      }
                    });

                    //틀린 문제 다 가져오기
                    params = {
                      TableName: "TestWrongAnswer",
                      FilterExpression: "#it = :it",
                      ExpressionAttributeNames: {
                        "#it": "id/test"
                      },
                      ExpressionAttributeValues: {
                        ":it": id + '/' + testNum
                      }
                    };

                    docClient.scan(params, function (err4, data4) {
                      if (err4) {
                        //실패
    console.log(101010);
                        console.error("Unable to query11. Error:", JSON.stringify(err4, null, 2));
                      } else {
                        //성공
                        //data6.Items.quest를 이용해 forEach로 "Quest"에서 문제 가오기
                        temp = [];
                        data4.Items.forEach(item => {
                          params = {
                            TableName: "Quest",
                            Key: {
                              "testNum": testNum,
                              "questNum": item.quest
                            }
                          };
                          docClient.get(params, function (err5, data5) {
                            if (err5) {
                              //실패
                              console.error("Unable to query12. Error:", JSON.stringify(err5, null, 2));
                            } else {
                              //성공
                              answer1 = data5.Item.answer1
                              answer2 = data5.Item.answer2
                              answer3 = data5.Item.answer3
                              answer4 = data5.Item.answer4
                              answer5 = data5.Item.answer5
                              var filePath = "한국사/" + testNum + "회/" + data5.Item.questNum + ".jpg";
                              console.log(filePath)
                              image = base64_encode(filePath)
                              if(data5.Item.answer1 == '(사진)') {
                                answer1 = base64_encode("한국사/" + testNum + "회/" + data5.Item.questNum + "-1.jpg")
                                answer2 = base64_encode("한국사/" + testNum + "회/" + data5.Item.questNum + "-2.jpg")
                                answer3 = base64_encode("한국사/" + testNum + "회/" + data5.Item.questNum + "-3.jpg")
                                answer4 = base64_encode("한국사/" + testNum + "회/" + data5.Item.questNum + "-4.jpg")
                                answer5 = base64_encode("한국사/" + testNum + "회/" + data5.Item.questNum + "-5.jpg")
                              }
                              console.log('변환 준비' + filePath)
                              slot = {
                                questionNum: data5.Item.questNum,    //문제번호
                                question: data5.Item.quest,       //문제
                                score: data5.Item.score,          //점수
                                image: image,          //문제 이미지
                                questType1: data5.Item.type1,     //문제 타입 ex)조선-역사
                                questType2: data5.Item.type2,     //문제 타입2 없으면 ""
                                isImageQuest: data5.Item.isImageQuest,   //이미지 문제인지 여부. 맞으면 true
                                answer1: answer1,        //지문 1~5
                                answer2: answer2,
                                answer3: answer3,
                                answer4: answer4,
                                answer5: answer5,
                                answer: data5.Item.answer,         //정답
                                comment: data5.Item.comment,        //해설
                              }
                              console.log('넣기 완료22')
                              temp.push(slot);
                              //console.log(slot);//여기입니다. 여기선 잘나옵니다.
                            }
                          });
                        })
                        //문제를 뽑아오는 것보다 정렬을 먼저 해버립니다.
                        console.log(temp);
                        str = {
                          result: true,
                          finalScore: finalScore,
                          wrongQuestions: temp
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        } else {//틀렸을 때
          //점수 없이 문제 번호 수정
          params = {
            TableName: "TestItem",
            Key: {
              "id": id,
              "testNum": testNum
            },
            UpdateExpression: "set questNum = :q",
            ExpressionAttributeValues: {
              ":q": 51
            }
          };

          docClient.update(params, function (err2, data2) {
            if (err2) {
              //실패
    console.log(111111);
              console.error("Unable to query13. Error:", JSON.stringify(err2, null, 2));
            } else {
              //성공
              //1.회차별 오답 리스트에 해당 문제 추가하기
              params = {
                TableName: "TestWrongAnswer",
                Item: {
                  "id/test": id + '/' + testNum,
                  "quest": questNum,
                  "select": userAnswer
                }
              };
              console.log(params)

              docClient.put(params, function (err3, data3) {
                if (err3) {
                  //실패
    console.log(121212);
                  console.error("Unable to query14. Error:", JSON.stringify(err3, null, 2));
                } else {
                  //성공
                  //type1에 대한 weakness 수정
                  params = {
                    TableName: "Weakness",
                    Key: {
                      "id": id,
                      "type": type1
                    },
                    UpdateExpression: "set solve = solve + :s",
                    ExpressionAttributeValues: {
                      ":s": 1
                    }
                  };
                  console.log(type1);
                  console.log(params)

                  docClient.update(params, function (err4, data4) {
                    if (err4) {
                      //실패
                      console.error("Unable to query15. Error:", JSON.stringify(err4, null, 2));
                    } else {
                      //성공
                      if (type2 != undefined) {//타입 2 가 있을 경우
                        //type2 에 대한 weakness 수정
                        params = {
                          TableName: "Weakness",
                          Key: {
                            "id": id,
                            "type": type2
                          },
                          UpdateExpression: "set solve = solve + :s",
                          ExpressionAttributeValues: {
                            ":s": 1
                          }
                        };

                        docClient.update(params, function (err5, data5) {
                          if (err5) {
                            //실패
    console.log(141414);
                            console.error("Unable to query16. Error:", JSON.stringify(err5, null, 2));
                          } else {
                            //성공
                            //일단 평균내는 것 부터 시작하자
                            params = {
                              TableName: "TestItem",
                              FilterExpression: "id = :i and questNum = :q",
                              ExpressionAttributeValues: {
                                ":i": id,
                                ":q": 51
                              }
                            };

                            docClient.scan(params, function (err6, data6) {
                              if (err6) {
                                //실패
    console.log(151515);
                                console.error("Unable to query17. Error:", JSON.stringify(err6, null, 2));
                              } else {
                                //성공
                                //User평균 점수
                                data6.Items.forEach(item => {
                                  if (testNum == item.testNum) {
                                    finalScore = item.score;
                                  }
                                  average = average + item.score;
                                  num++;
                                });
                                average = average / num;
                                params = {
                                  TableName: "User",
                                  Key: {
                                    "id": id
                                  },
                                  UpdateExpression: "set averageScore = :as",
                                  ExpressionAttributeValues: {
                                    ":as": average
                                  }
                                };

                                docClient.update(params, function (err7, data7) {
                                  if (err7) {
                                    console.log(161616);
                                    //실패
                                    console.error("Unable to query18. Error:", JSON.stringify(err7, null, 2));
                                  } else {
                                    //성공
                                  }
                                });
                              }
                            });

                            //틀린 문제 다 가져오기
                            params = {
                              TableName: "TestWrongAnswer",
                              FilterExpression: "#it = :it",
                              ExpressionAttributeNames: {
                                "#it": "id/test"
                              },
                              ExpressionAttributeValues: {
                                ":it": id + '/' + testNum
                              }
                            };

                            docClient.scan(params, function (err6, data6) {
                              if (err6) {
                                console.log(171717);
                                //실패
                                console.error("Unable to query19. Error:", JSON.stringify(err6, null, 2));
                              } else {
                                //성공
                                //data6.Items.quest를 이용해 forEach로 "Quest"에서 문제 가오기
                                temp = [];
                                data6.Items.forEach(item => {
                                  params = {
                                    TableName: "Quest",
                                    Key: {
                                      "testNum": testNum,
                                      "questNum": item.quest
                                    }
                                  };
                                  docClient.get(params, function (err7, data7) {
                                    if (err7) {
                                      //실패
                                      console.error("Unable to query20. Error:", JSON.stringify(err7, null, 2));
                                    } else {
                                      //성공
                                      answer1 = data7.Item.answer1
                                      answer2 = data7.Item.answer2
                                      answer3 = data7.Item.answer3
                                      answer4 = data7.Item.answer4
                                      answer5 = data7.Item.answer5
                                      var filePath = "한국사/" + testNum + "회/" + data7.Item.questNum + ".jpg";
                                      image = base64_encode(filePath)
                                      if(data7.Item.answer1 == '(사진)') {
                                        answer1 = base64_encode("한국사/" + testNum + "회/" + data7.Item.questNum + "-1.jpg")
                                        answer2 = base64_encode("한국사/" + testNum + "회/" + data7.Item.questNum + "-2.jpg")
                                        answer3 = base64_encode("한국사/" + testNum + "회/" + data7.Item.questNum + "-3.jpg")
                                        answer4 = base64_encode("한국사/" + testNum + "회/" + data7.Item.questNum + "-4.jpg")
                                        answer5 = base64_encode("한국사/" + testNum + "회/" + data7.Item.questNum + "-5.jpg")
                                      }
                                      console.log('변환준비!' + filePath)
                                      console.log('됐냐?' + image)
                                        slot = {
                                          questionNum: data7.Item.questNum,    //문제번호
                                          question: data7.Item.quest,       //문제
                                          score: data7.Item.score,          //점수
                                          image: image,          //문제 이미지
                                          questType1: data7.Item.type1,     //문제 타입 ex)조선-역사
                                          questType2: data7.Item.type2,     //문제 타입2 없으면 ""
                                          isImageQuest: data7.Item.isImageQuest,   //이미지 문제인지 여부. 맞으면 true
                                          answer1: answer1,        //지문 1~5
                                          answer2: answer2,
                                          answer3: answer3,
                                          answer4: answer4,
                                          answer5: answer5,
                                          answer: data7.Item.answer,        //정답
                                          comment: data7.Item.comment        //해설
                                        }
                                        temp.push(slot);
                                        //console.log(slot);//여기입니다. 여기선 잘나옵니다.
                                      }
                                      console.log('넣기 완료스!')
                                  });
                                })
                                //문제를 뽑아오는 것보다 정렬을 먼저 해버립니다.
                                console.log(temp);
                                str = { 
                                  result: true,
                                  finalScore: finalScore,
                                  wrongQuestions: temp
                                }
                              }
                            });
                          }
                        });
                      } else { //타입 2 가 없을 경우
                        //일단 평균내는 것 부터 시작하자
                        params = {
                          TableName: "TestItem",
                          FilterExpression: "id = :i and questNum = :q",
                          ExpressionAttributeValues: {
                            ":i": id,
                            ":q": 51
                          }
                        };

                        docClient.scan(params, function (err5, data5) {
                          if (err5) {
                            //실패
    console.log(191919);
                            console.error("Unable to query21. Error:", JSON.stringify(err5, null, 2));
                          } else {
                            //성공
                            data5.Items.forEach(item => {
                              if (testNum == item.testNum) {
                                finalScore = item.score;
                              }
                              average = average + item.score;
                              num++;
                            })
                            average = average / num;
                            params = {
                              TableName: "User",
                              Key: {
                                "id": id
                              },
                              UpdateExpression: "set averageScore = :as",
                              ExpressionAttributeValues: {
                                ":as": average
                              }
                            };

                            docClient.update(params, function (err6, data6) {
                              if (err6) {
                                //실패
    console.log(202020);
                                console.error("Unable to query22. Error:", JSON.stringify(err6, null, 2));
                              } else {
                                //성공
                              }
                            });
                          }
                        });

                        //틀린 문제 다 가져오기
                        params = {
                          TableName: "TestWrongAnswer",
                          FilterExpression: "#it = :it",
                          ExpressionAttributeNames: {
                            "#it": "id/test"
                          },
                          ExpressionAttributeValues: {
                            ":it": id + '/' + testNum
                          }
                        };

                        docClient.scan(params, function (err5, data5) {
                          if (err5) {
                            //실패
    console.log(212121);
                            console.error("Unable to query23. Error:", JSON.stringify(err5, null, 2));
                          } else {
                            
                            console.log(123)
                            //성공
                            //data6.Items.quest를 이용해 forEach로 "Quest"에서 문제 가오기
                            temp = [];
                            data5.Items.forEach(item => {
                              params = {
                                TableName: "Quest",
                                Key: {
                                  "testNum": testNum,
                                  "questNum": item.quest
                                }
                              };
                              docClient.get(params, function (err6, data6) {
                                if (err6) {
                                  //실패
    console.log(222222);
                                  console.error("Unable to query24. Error:", JSON.stringify(err6, null, 2));
                                } else {
                                  //성공
                                  answer1 = data6.Item.answer1
                                  answer2 = data6.Item.answer2
                                  answer3 = data6.Item.answer3
                                  answer4 = data6.Item.answer4
                                  answer5 = data6.Item.answer5
                                  var filePath = "한국사/" + testNum + "회/" + data6.Item.questNum + ".jpg";
                                  image = base64_encode(filePath)
                                  if(data6.Item.answer1 == '(사진)') {
                                    answer1 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-1.jpg")
                                    answer2 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-2.jpg")
                                    answer3 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-3.jpg")
                                    answer4 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-4.jpg")
                                    answer5 = base64_encode("한국사/" + testNum + "회/" + data6.Item.questNum + "-5.jpg")
                                  }
                                  slot = {
                                    questionNum: data6.Item.questNum,    //문제번호
                                    question: data6.Item.quest,       //문제
                                    score: data6.Item.score,          //점수
                                    image: image,          //문제 이미지
                                    questType1: data6.Item.type1,     //문제 타입 ex)조선-역사
                                    questType2: data6.Item.type2,     //문제 타입2 없으면 ""
                                    isImageQuest: data6.Item.isImageQuest,   //이미지 문제인지 여부. 맞으면 true
                                    answer1: answer1,        //지문 1~5
                                    answer2: answer2,
                                    answer3: answer3,
                                    answer4: answer4,
                                    answer5: answer5,
                                    answer: data6.Item.answer,         //정답
                                    comment: data6.Item.comment        //해설
                                  }
                                  temp.push(slot);
                                  console.log(123)
                                  //console.log(slot);//여기입니다. 여기선 잘나옵니다.

                                  //틀린 문제를 가져온 다음 지워야 하기 때문에 터지는 것을 방지하기 위해 이다음부터 순차적으로 만들겠습니다.
                                }
                              });
                            })
                            //문제를 뽑아오는 것보다 정렬을 먼저 해버립니다.
                            console.log(temp);
                            str = {
                              result : true,
                              finalScore: finalScore,
                              wrongQuestions: temp
                            }
                            console.log(str)
                          }
                        });
                      }
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  }
  catch (e) {
    //기타 에러
    str = {
      result: false,
      errCode: 101
    }
  }
  console.log("dsadsd")
  await waitALong();
  console.log(str.wrongQuestions);
  str.wrongQuestions.sort(customSort);//정렬
  console.log(str.wrongQuestions);
  res.json(str);
})

//9. 회차별 문제풀이-4(중간종료) // 끝
server.get("/DoTest/StopTestByNum", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("stopTestByNum function is running");
    var str = {result : true};
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum*1     //시험 회차
        let questNum = req.query.questNum*1   //문제 번호

        console.log(testNum + '.' + questNum)

        //해당 회차-문제 번호를 저장해주면 돼.
        params = {
          TableName: "TestItem",
          Key: {
            "id": id,
            "testNum": testNum
          },
          UpdateExpression: "set questNum = :q",
          ExpressionAttributeValues: {
            ":q": questNum
          }
        };

        console.log(params)

        docClient.update(params, function (err, data) {
          if(err) {
            //실패
          } else {
            //성공
            console.log(data)
          }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str ={
                result : false,
                errCode : 101
            }
    }

    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//10. 랜덤 문제풀이-1(시작) //끝
server.get("/DoTest/StartRandomTest", async(req,res) => {
    console.log(requestIP.getClientIp(req));  
    console.log("StartRandomTest function is running");
    var str;
    try {
        let id = req.query.id;              //id
        var testNum;
        var questNum;
        //DB에서 해당 id의 랜덤 문제 중간종료 여부 검색
        //이것도 회원가입할 때 만들어 놓을까요?

        var question;       //문제
        var score;          //점수
        var image;          //문제 이미지
        var questType1;     //문제 타입 ex)조선-역사
        var questType2;     //문제 타입2 없으면 ""
        var isImageQuest;   //이미지 문제인지 여부. 맞으면 true
        var answer1;        //지문 1~5
        var answer2;
        var answer3;
        var answer4;
        var answer5;
        var answer;         //정답
        var comment;        //해설

        params = {
          TableName: "RandomWait",
          Key: {
            "id": id
          }
        };

        docClient.get(params, function (err1, data1) {
          if (err1) {
            //샐패
            console.log(111);
            throw err1
          } else {
            //성공
            if (data1.Item.questNum == 0) {//or data.Item == Undefined)//중간종료 한 적 있으면 거기부터 시작
              testNum = getRandomInt(33, 45); //선희꺼 받으면 고치자 6,45
              questNum = getRandomInt(1, 50);
              console.log(testNum + " " + questNum);
            } else {
              testNum = data1.Item.testNum;
              questNum = data1.Item.questNum;
              console.log('in : ' + testNum + ' ' + questNum)
            }
            console.log('out : ' + testNum + ' ' + questNum)
            // var testNum;        //회차번호
            // var questionNum;    //문제번호
            params = {
              TableName: "Quest",
              Key: {
                "testNum": testNum,
                "questNum": questNum
              }
            };

            console.log(testNum + ' ' + questNum)

            docClient.get(params, function(err2, data2) {
              if (err2) {
                //실패
                console.log('tq')
                throw err2
              } else {
                //성공
                temp = data2.Item;
                console.log(temp)

                question = temp.quest;       //문제
                score = temp.score;          //점수
                questType1 = temp.type1;     //문제 타입 ex)조선-역사
                questType2 = temp.type2;     //문제 타입2 없으면 ""
                isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                answer1 = temp.answer1;        //지문 1~5
                answer2 = temp.answer2;
                answer3 = temp.answer3;
                answer4 = temp.answer4;
                answer5 = temp.answer5;
                answer = temp.answer;         //정답
                comment = temp.comment;        //해설

                var filePath = "한국사/" + testNum + "회/" + questNum + ".jpg";
                image = base64_encode(filePath)
                if(answer1 == '(사진)' || answer1 == '(그림)') {
                  answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                  answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                  answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                  answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                  answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                }
                
                str = {
                    result : true,

                    testNum : testNum,
                    questionNum : questNum,
                    question : question,
                    score : score,
                    image : image,
                    questType1 : questType1,
                    questType2 : questType2,
                    isImageQuest : isImageQuest,
                    answer1 : answer1,
                    answer2 : answer2,
                    answer3 : answer3,
                    answer4 : answer4,
                    answer5 : answer5,
                    answer : answer,
                    comment : comment
                }
              }
            });
          }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 101}
    }

    await waitAMiddle();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//11. 랜덤 문제풀이-2(계속) //끝
server.get("/DoTest/ContinueRandomTest", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("ContinueRandomTest function is running");
    var str;
    try {
        let id = req.query.id;              //id
        var testNum = req.query.testNum*1     //시험 회차
        let questNum = req.query.questNum*1   //문제 번호
        let userAnswer = req.query.answer*1   //정답

        //DB에서 해당 testNum과 questNum이 일치하는 데이터를 찾아서
        //진짜 정답 가져오기
        let realAnswer; //진짜 정답
        let type1;//문제 타입1
        let type2;//문제 타입2

        params = {
          TableName: "Quest",
          Key: {
            "testNum": testNum,
            "questNum": questNum
          }
        };

        docClient.get(params, function (err1, data1) {
          if (err1) {
            //실패
            console.log(555)
            throw err1
          } else {
            //성공
            temp = data1.Item;
            realAnswer = temp.answer;
            type1 = temp.type1;
            type2 = temp.type2;

            if(userAnswer == realAnswer) {
                //취약점 분석에 푼 갯수, 맞은 갯수 추가하기.
                params = {
                  TableName: "Weakness",
                  Key: {
                    "id": id,
                    "type": type1
                  },
                  UpdateExpression: "set solve = solve + :s, correct = correct + :c",
                  ExpressionAttributeValues: {
                    ":s" : 1,
                    ":c" : 1
                  }
                },

                docClient.update(params, function (err2, data2) {
                  if (err2) {
                    //실패
                console.log(444)
                    throw err2
                  } else {
                    //성공
                  }
                });

                if(type2 != undefined) {
                  params = {
                    TableName: "Weakness",
                    Key: {
                      "id": id,
                      "type": type2
                    },
                    UpdateExpression: "set solve = solve + :s, correct = correct + :c",
                    ExpressionAttributeValues: {
                      ":s": 1,
                      ":c": 1
                    }
                  }

                  docClient.update(params, function (err2, date2) {
                    if (err2) {
                      //실패
                console.log(333)
                      throw err2
                    } else {
                      //성공
                    }
                  });
                }
            }
            else {
                //취약점 분석에 푼 갯수만 추가하기.
                params = {
                  TableName: "Weakness",
                  Key: {
                    "id": id,
                    "type": type1
                  },
                  UpdateExpression: "set solve = solve + :s",
                  ExpressionAttributeValues: {
                    ":s" : 1
                  }
                }
                console.log(params);

                docClient.update(params, function (err2, data2) {
                  if (err2) {
                    //실패
                console.log(222)
                    throw err2
                  } else {
                    //성공
                  }
                });

                if(type2 != undefined) {
                  params = {
                    TableName: "Weakness",
                    Key: {
                      "id": id,
                      "type": type2
                    },
                    UpdateExpression: "set solve = solve + :s",
                    ExpressionAttributeValues: {
                      ":s": 1
                    }
                  }

                  docClient.update(params, function (err2, date2) {
                    if (err2) {
                      //실패
                      throw err2
                    } else {
                      //성공
                    }
                  });
                }
            }

            testNum = getRandomInt(33,45); //이것도 고치자
            questNum = getRandomInt(1, 50);

            //다음으로 아무문제 랜덤으로 하나만 뽑아와.
            //요건 외 더티코딩질 안했냐면 전부 각각의 테이블에 서로 상관 없는 것들이라 그랬어요.
            params = {
              TableName: "Quest",
              Key: {
                "testNum": testNum,
                "questNum": questNum
              }
            };

            docClient.get(params, function(err, data) {
              if (err) {
                //실패
                console.log(111)
                throw err;
              } else {
                //성공
                temp = data.Item;
                testNum = temp.testNum;        //회차번호
                var questionNum = temp.questNum;    //문제번호
                var question = temp.quest;       //문제
                var score = temp.score;          //점수
                var questType1 = temp.type1;     //문제 타입 ex)조선-역사
                var questType2 = temp.type2;     //문제 타입2 없으면 ""
                var isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                var answer1 = temp.answer1;        //지문 1~5
                var answer2 = temp.answer2;
                var answer3 = temp.answer3;
                var answer4 = temp.answer4;
                var answer5 = temp.answer5;
                var answer = temp.answer;         //정답
                var comment = temp.comment;        //해설

                var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                image = base64_encode(filePath)
                if(answer1 == '(사진)' || answer1 == '(그림)') {
                  answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                  answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                  answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                  answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                  answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                }

                str = {
                    result : true,

                    testNum : testNum,
                    questionNum : questionNum,
                    question : question,
                    score : score,
                    image : image,
                    questType1 : type1,
                    questType2 : type2,
                    isImageQuest : isImageQuest,
                    answer1 : answer1,
                    answer2 : answer2,
                    answer3 : answer3,
                    answer4 : answer4,
                    answer5 : answer5,
                    answer : answer,
                    comment : comment
                }
              }
            });
          }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 101}
    }

    await waitAMiddle();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//12. 랜덤 문제풀이-3(중간종료)// 끝
server.get("/DoTest/StopRandomTest", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("StopRandomTest function is running");
    var str = {result : true};
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum*1     //시험 회차
        let questNum = req.query.questNum*1   //문제 번호
        //해당 회차-문제 번호를 저장해주면 돼.

        params = {//이것도 회원가입할 때 만드는 게 좋을 것 같네
          TableName: "RandomWait",
          Key: {
            "id": id
          },
          UpdateExpression: "set testNum = :t, questNum = :q",
          ExpressionAttributeValues: {
            ":t": testNum,
            ":q": questNum
          }
        };

        docClient.update(params, function (err, data) {
          if (err) {
            //실패
            throw err
          } else {
            //성공
          }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str ={
                result : false,
                errCode : 101
            }
    }

    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//13. 빈칸 맞추기
server.get("/DoTest/GetSentenceQuest", async(req,res) => {
  console.log(requestIP.getClientIp(req));
  console.log("GetSentenceQuest function is running");
  var fs = require('fs')

  chk = false;
  quest = ''
  answer = ''

  str = {
    result : false, 
    errCode : 101
  }

  fs.readFile('sentences.txt', 'utf8', function(error, sentenceData) {
    sentenceData = sentenceData.split('\n')
    fs.readFile('keyWords.txt', 'utf-8', function(error, keyWords) {
      keyWords = keyWords.split('\n')
      console.log(keyWords)
      while(true) {
        randNum = Math.random() * sentenceData.length;
        randNum = Math.floor(randNum)
        console.log(sentenceData[randNum])
        for(i = 0; i < keyWords.length; i++) {
          console.log(i + keyWords[i]);
          keyWords[i] = keyWords[i].replace(/\r/g,"")
          if(sentenceData[randNum].indexOf(keyWords[i]) != -1) {
            quest = sentenceData[randNum]
            answer = keyWords[i]
            chk = !chk;
            break;
          }
        }
        if(chk) {
          quest = quest.replace(/\r/g,"");
          answer = answer.replace(/\r/g,"")
          str = {
            result : true,
            quest : quest,
            answer : answer
          }
          break;
        }
      }
    })
  })
  await waitASecond();
  res.json(str)

})

//3. 오답노트
//14. 오답노트 저장_1 한 문제 //끝
server.get("/Ohdob/SaveQuestion", async(req, res) => {
    console.log(requestIP.getClientIp(req));
    console.log("SaveQuestion function is running");
    var str = {result : true};
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호

        //해당 회차-문제 번호를 오답노트에 저장해주면 돼
        params = {
          TableName: "MyNote",
          Key: {
            "id": id,
            "testQuest": testNum + '/' + questNum
          }
        };

        docClient.get(params, function (err1, data1) {
          if (err1) {
            //실패
            throw err1
          } else {
            //성공(읽기에 성공)
            console.log(data1.Item)
            if (data1.Item != undefined) {//읽어온 data에 항목이 있을 경우
              str = {result : false, errCode : 101};
            } else {
              params = {
                TableName: "MyNote",
                Item: {
                  "id": id,
                  "testQuest": testNum + '/' +questNum
                }
              };
              console.log(params)

              docClient.put(params, function (err2, data2) {
                if (err2) {
                  //실패
                  throw err2
                } else {
                  //성공
                }
              });
            }
          }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str ={
                result : false,
                errCode : 102
            }
    }
    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//15. 오답노트 저장_2 여러 문제 //끝
server.get("/Ohdob/SaveQuestions", async(req, res) => {
    console.log(requestIP.getClientIp(req));
    console.log("SaveQuestions function is running");
    var str = {result : true};
    try {
        let id = req.query.id;              //id
        var testNum = req.query.testNum;

        let i = 0;

        while(true) {
            eval("var questNum" + i + "=req.query.questNum" + i)
            console.log(eval("questNum" + i))
            if(eval("questNum" + i) == undefined) break
            i++;
        }
        for(var j = 0; j<i; j++) {
            //하나씩 저장
            //불러올 때는 변수명 대신 eval("testNum" + j) 이렇게 하는거야.
            //ex) testNum0 이런거 대신 위에꺼 쓰라는 말임.
            params = {
              TableName: "MyNote",
              Item: {
                "id": id,
                "testQuest": testNum + '/' + eval("questNum" + j)
              }
            };
            console.log(params)

            docClient.put(params, function (err, data) {
              if (err) {
                //실패
                throw err
              } else {
                //성공
              }
            });
        }
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str ={
                result : false,
                errCode : 101
            }
    }
    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//16. 오답노트 전체조회//예도 개선(되긴 함) //끝
server.get("/Ohdob/GetSaveQuestion", async(req, res) => {
   console.log(requestIP.getClientIp(req));
   chk = true
    console.log("GetSaveQuestion function is running");
    var str;
    try {
        let id = req.query.id;              //id
        //해당 아이디에 저장된 모든 오답노트를 불러와야 됨.
        var questions = [];
        function customSort(a, b) {
          if(a.testNum == b.testNum) {
            if(a.questNum == b.questNum) {
             return 0;
            }
            return a.questNum > b.questNum ? 1 : -1;
           }
           return a.testNum > b.testNum ? 1 : -1;
         }

        var testNum;        //회차번호
        var questionNum;    //문제번호
        var question;       //문제
        var score;          //점수
        var image;          //문제 이미지
        var questType1;     //문제 타입 ex)조선-역사
        var questType2;     //문제 타입2 없으면 ""
        var isImageQuest;   //이미지 문제인지 여부. 맞으면 true
        var answer1;        //지문 1~5
        var answer2;
        var answer3;
        var answer4;
        var answer5;
        var answer;         //정답
        var comment;        //해설

        params = {
          TableName: "MyNote",
          KeyConditionExpression: "#i = :i",
          ExpressionAttributeNames: {
            "#i": "id"
          },
          ExpressionAttributeValues: {
            ":i": id
          }
        };

        temp2 = []
        console.log(params)

        docClient.query(params, function (err1, data1) {
          if (err1) {
            throw err1
          } else {
            console.log(data1);
            if(data1.Count == 0) {//저장된 문제가 없을 경우
              str = {
                result : false,
                errCode : 101
              }
              chk = false;
            } else {//저장된 문제가 'x/x'형태로 존재
              temp = data1.Items;
              for(var i = 0; i< temp.length; i++) {
                console.log(temp);
                var num = temp[i].testQuest.split('/');
                testNum = num[0]*1;
                questNum = num[1]*1;
                params = {
                  TableName: "Quest",
                  Key: {
                    "testNum": testNum,
                    "questNum": questNum
                  }
                };

                docClient.get(params, function (err2, data2) {
                  if (err2) {
                    //실패
                    throw err2
                  } else {
                    //성공
                    answer1 = data2.Item.answer1
                    answer2 = data2.Item.answer2
                    answer3 = data2.Item.answer3
                    answer4 = data2.Item.answer4
                    answer5 = data2.Item.answer5
                    var filePath = "한국사/" + testNum + "회/" + data2.Item.questNum + ".jpg";
                    image = base64_encode(filePath)
                    if(data2.Item.answer1 == '(사진)') {
                      answer1 = base64_encode("한국사/" + testNum + "회/" + data2.Item.questNum + "-1.jpg")
                      answer2 = base64_encode("한국사/" + testNum + "회/" + data2.Item.questNum + "-2.jpg")
                      answer3 = base64_encode("한국사/" + testNum + "회/" + data2.Item.questNum + "-3.jpg")
                      answer4 = base64_encode("한국사/" + testNum + "회/" + data2.Item.questNum + "-4.jpg")
                      answer5 = base64_encode("한국사/" + testNum + "회/" + data2.Item.questNum + "-5.jpg")
                    }
                    slot = {
                      testNum: data2.Item.testNum,
                      questionNum: data2.Item.questNum,    //문제번호
                      question: data2.Item.quest,       //문제
                      score: data2.Item.score,          //점수
                      image: image,          //문제 이미지
                      questType1: data2.Item.type1,     //문제 타입 ex)조선-역사
                      questType2: data2.Item.type2,     //문제 타입2 없으면 ""
                      isImageQuest: data2.Item.isImageQuest,   //이미지 문제인지 여부. 맞으면 true
                      answer1: answer1,        //지문 1~5
                      answer2: answer2,
                      answer3: answer3,
                      answer4: answer4,
                      answer5: answer5,
                      answer: data2.Item.answer,         //정답
                      comment: data2.Item.comment        //해설
                    }
                    temp2.push(slot);
                    console.log(123)
                    console.log(slot);//여기입니다. 여기선 잘나옵니다.
                  }
                  temp.sort(customSort);
                });
              }
            }
          }
        });
        //}
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {
            result: false,
            errCode : 102
          }
          chk = false
    }
    await waitALong();
    console.log(str)
    console.log("결과출력");
    if (chk) {
      str = {
          result: true,
          //여기가 중요한데, jsonArray 형식으로 틀린 것들을 전부
          //뽑아줘야 해. 구글링 잘 하면서 해봐. 화이팅...ㅠㅠ
          wrongQuestions:temp2
        }
      }
    res.json(str);
})

//17. 오답노트 삭제 //끝
server.get("/Ohdob/DeleteQuestion", async(req, res) => {
   console.log(requestIP.getClientIp(req));
    console.log("DeleteQuestion function is running");
    var str = {result : true};
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호

        //해당 회차-문제 번호를 오답노트에서 삭제하면 됨
        params = {
          TableName: "MyNote",
          Key: {
            "id": id,
            "testQuest": testNum + '/' + questNum
          }
        };
        console.log(params);

        docClient.delete(params, function (err, data) {
          if (err) {
            //실패
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            throw err
          } else {
            //성공
          }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str ={
                result : false,
                errCode : 101
            }
    }
    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//18. 오답노트 랜덤 풀이//다시 해야 된다. // 끝
server.get("/Ohdob/DoOhdobTest", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("DoOhdobTest function is running");

    var testNum;        //회차번호
    var questNum;    //문제번호
    var question;       //문제
    var score;          //점수
    var image;          //문제 이미지
    var questType1;     //문제 타입 ex)조선-역사
    var questType2;     //문제 타입2 없으면 ""
    var isImageQuest;   //이미지 문제인지 여부. 맞으면 true
    var answer1;        //지문 1~5
    var answer2;
    var answer3;
    var answer4;
    var answer5;
    var answer;         //정답
    var comment;        //해설

    var checkWait = true;

    var str;
    try {
        let id = req.query.id;              //id
        //DB에서 해당 id의 랜덤 문제 중간종료 여부 검색

        params = {
          TableName: "MyNoteWait",
          Key: {
            "id": id
          }
        };

        docClient.get(params, function (err1, data1) {
          if (err1) {
            //실패
            throw err1
          } else {
            //성공
            if (data1.Item.testNum == 0){//중간 종료 여부가 없었을 경우
              params = {
                TableName: "MyNote",
                KeyConditionExpression: "#i = :i",
                ExpressionAttributeNames: {
                  "#i": "id"
                },
                ExpressionAttributeValues: {
                  ":i": id
                }
              };

              docClient.query(params, function (err2, data2) {
                if (err2) {
                  //실패
                  throw err2
                } else {
                  //성공
                  if (data2.Count == 0) {//오답노트가 없을 경우
                    str = { result : false, errCode : 101};
                  } else {
                    //불러오기 성공
                    console.log(data2);
                    temp = data2.Items;
                    var randomInt = getRandomInt(0, temp.length-1);
                    var num = temp[randomInt].testQuest.split('/');
                    testNum = num[0] * 1;
                    questNum = num[1] * 1;
                    params = {
                      TableName: "Quest",
                      Key: {
                        "testNum": testNum,
                        "questNum": questNum
                      }
                    };

                    docClient.get(params, function (err3, data3) {
                      if (err3) {
                        //실패
                        throw err3
                      } else {
                        //성공
                        testNum = data3.Item.testNum;
                        questNum = data3.Item.questNum;
                        question = data3.Item.quest;
                        score = data3.Item.score;
                        image = data3.Item.image;
                        questType1 = data3.Item.type1;
                        questType2 = data3.Item.type2;
                        isImageQuest = data3.Item.isImageQuest;
                        answer1 = data3.Item.answer1;
                        answer2 = data3.Item.answer2;
                        answer3 = data3.Item.answer3;
                        answer4 = data3.Item.answer4;
                        answer5 = data3.Item.answer5;
                        answer = data3.Item.answer;
                        comment = data3.Item.comment;

                        var filePath = "한국사/" + testNum + "회/" + questNum + ".jpg";
                        image = base64_encode(filePath)
                        if(data3.Item.answer1 == '(사진)') {
                          answer1 = base64_encode("한국사/" + testNum + "회/" + questNum + "-1.jpg")
                          answer2 = base64_encode("한국사/" + testNum + "회/" + questNum + "-2.jpg")
                          answer3 = base64_encode("한국사/" + testNum + "회/" + questNum + "-3.jpg")
                          answer4 = base64_encode("한국사/" + testNum + "회/" + questNum + "-4.jpg")
                          answer5 = base64_encode("한국사/" + testNum + "회/" + questNum + "-5.jpg")
                        }

                        str = {
                            result : true,
                            testNum : testNum,
                            questionNum : questNum,
                            question : question,
                            score : score,
                            image : image,
                            questType1 : questType1,
                            questType2 : questType2,
                            isImageQuest : isImageQuest,
                            answer1 : answer1,
                            answer2 : answer2,
                            answer3 : answer3,
                            answer4 : answer4,
                            answer5 : answer5,
                            answer : answer,
                            comment : comment
                        }
                        console.log(str);//ㅂㄱㄹ
                      }
                    });
                  }
                }
              });
            } else {//중간 종료 여부가 있을 경우
              testNum = data1.Item.testNum;
              questNum = data1.Item.questNum;
              //중간 종료 여부가 있을 경우
              //문제를 가져오는 과정
              params = {
                TableName: "Quest",
                Key: {
                  "testNum": testNum,
                  "questNum": questNum
                }
              };

              docClient.get(params, function (err2, data2) {
                if (err2) {
                  //실패
                  throw err2
                } else {
                  //성공
                  testNum = data2.Item.testNum;
                  questNum = data2.Item.questNum;
                  question = data2.Item.quest;
                  score = data2.Item.score;
                  image = data2.Item.image;
                  questType1 = data2.Item.type1;
                  questType2 = data2.Item.type2;
                  isImageQuest = data2.Item.isImageQuest;
                  answer1 = data2.Item.answer1;
                  answer2 = data2.Item.answer2;
                  answer3 = data2.Item.answer3;
                  answer4 = data2.Item.answer4;
                  answer5 = data2.Item.answer5;
                  answer = data2.Item.answer;
                  comment = data2.Item.comment;

                  var filePath = "한국사/" + testNum + "회/" + questNum + ".jpg";
                  image = base64_encode(filePath)
                  if(data2.Item.answer1 == '(사진)') {
                    answer1 = base64_encode("한국사/" + testNum + "회/" + questNum + "-1.jpg")
                    answer2 = base64_encode("한국사/" + testNum + "회/" + questNum + "-2.jpg")
                    answer3 = base64_encode("한국사/" + testNum + "회/" + questNum + "-3.jpg")
                    answer4 = base64_encode("한국사/" + testNum + "회/" + questNum + "-4.jpg")
                    answer5 = base64_encode("한국사/" + testNum + "회/" + questNum + "-5.jpg")
                }
                str = {
                    result : true,

                    testNum : testNum,
                    questionNum : questNum,
                    question : question,
                    score : score,
                    image : image,
                    questType1 : questType1,
                    questType2 : questType2,
                    isImageQuest : isImageQuest,
                    answer1 : answer1,
                    answer2 : answer2,
                    answer3 : answer3,
                    answer4 : answer4,
                    answer5 : answer5,
                    answer : answer,
                    comment : comment
                }
              }
              });
              //중간 저장을 지우는 과정
              //testNum = 0으로 수정
              params = {
                TableName: "MyNoteWait",
                Key: {
                  "id": id
                },
                UpdateExpression: "set #t = :t, #q = :q",
                ExpressionAttributeNames: {
                  "#t": "testNum",
                  "#q": "questNum"
                },
                ExpressionAttributeValues: {
                  ":t": 0,
                  ":q": 0
                }
              };

              docClient.update(params, function (err2, data2) {
                if (err2) {
                  //실패
                  throw err2
                } else {
                  //성공
                }
              });
            }
          }
        });

        //중간종료 한 적 있으면 거기부터 시작
        //그리고 오답노트 풀이 같은 경우는 다른 문제풀이랑 달리
        //시작 - 계속 으로 나뉘지 않고 계속 시작 이거든?
        //그러니까 중간종료 이력 삭제나 초기화 해야해.
        //안그러면 같은 문제만 계속 나옴



        /*
        if (저장된 오답노트가 없다면) {
            str = { result : false, errCode : 101};
        }
        else {
        */
        //}
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 102}
    }

    await waitAMiddle();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//19. 오답노트 랜덤 풀이 종료 //끝
server.get("/Ohdob/ExitOhdobTest", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("ExitOhDobTest function is running");
    var str = {result : true};
    try{
        let id = req.query.id;              //id
        let testNum = req.query.testNum * 1;     //시험 회차
        let questNum = req.query.questNum * 1;   //문제 번호

        params = {
          TableName: "MyNoteWait",
          Key: {
            "id": id
          },
          UpdateExpression: "set #t = :t, #q = :q",
          ExpressionAttributeNames: {
            "#t": "testNum",
            "#q": "questNum"
          },
          ExpressionAttributeValues: {
            ":t": testNum,
            ":q": questNum
          },
          ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function (err, data) {
          if (err) {
            //실패
            throw err
          } else {
            //성공
          }
        });
        //현재 상태 저장하셈.
    }
    catch(e) {
        console.log(e)
        str = {result : false, errCode : 101}
    }
    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str)
})

//4. 취약점 분석
//20. 취약점 리스트 조회//더러워 보이지만 클리어
server.get("/Weakness/GetMyWeakness", async(req, res) => {
    console.log(requestIP.getClientIp(req));
    console.log("GetMyWeakness function is running");
    var str;
    try {
        let id = req.query.id;              //id
        //해당 아이디에 저장된 취약점들을 불러와야 해.
        var questType;      //문제 분류
        var solvedQuests;   //푼 총 문제 갯수
        var answerQuests;   //정답인 문제 갯수
        var videoURL;       //추천 동영상 강의
        console.log("---" + id);

        function customSort(a, b) {
          if((a.correct / a.solve) == (b.correct / b.solve)) {
             return 0
           }
           return (a.correct / a.solve) > (b.correct / b.solve) ? 1 : -1;
         }

        var params = {
          TableName: "Weakness",
          KeyConditionExpression: "#i = :i",
          ExpressionAttributeNames: {
            "#i": "id"
          },
          ExpressionAttributeValues: {
            ":i": id
          }
        };

        console.log(params)

        docClient.query(params, function (err, data) {
          if (err) {
            //실패
            throw err
          } else {
            //성공
            var checkNum = true;//5개 미만의 타입을 체크한다
            
            // for (var i = 0; i < data.Count; i++) {
            //   if (data.Items[i].solve < 5) {
            //     checkNum = false;
            //     break;
            //   }
            // }
            console.log(data)
            if (checkNum) {//5미만의 타입이 존재하지 않을 경우
              data.Items.sort(customSort);//예정되로 된다면 //성공했으
              temp = [];
              for (var i = 0; i < data.Count; i++) {
                var slot = {
                  questType : data.Items[i].type,
                  solvedQuests : data.Items[i].solve,
                  answerQuests : data.Items[i].correct,
                  videoURL : "https://www.youtube.com/watch?v=ogdGVSBXGuY&list=PLwFVnC_J7ONIqJVw1iNiNdtFuddMZn_Te&index=40"
                  //videoURL : data.Items[i].URL
                  //나중에 고쳐야댐
                }
                temp.push(slot);
              }
              str = {
                  result: true,
                  weakness: temp
                }
            } else {//5미만의 타입이 존재할 경우
              str = {
                  result: false,
                  errCode : 101
              }
            }
          }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {
            result : false,
            errCode : 102
          }
    }
    await waitAMiddle();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//21. 취약점 문제풀이_시작 //끝
server.get("/Weakness/StartWeaknessTest", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("StartWeaknessTest function is running");
    var str;
    try {
        let id = req.query.id;              //id

        var testNum;        //회차번호
        var questionNum;    //문제번호
        var question;       //문제
        var score;          //점수
        var image;          //문제 이미지
        var questType1;     //문제 타입 ex)조선-역사
        var questType2;     //문제 타입2 없으면 ""
        var isImageQuest;   //이미지 문제인지 여부. 맞으면 true
        var answer1;        //지문 1~5
        var answer2;
        var answer3;
        var answer4;
        var answer5;
        var answer;         //정답
        var comment;        //해설

        function customSort(a, b) {
          if((a.correct / a.solve) == (b.correct / b.solve)) {//정렬
             return 0
           }
           return (a.correct / a.solve) > (b.correct / b.solve) ? 1 : -1;
         }

        var getType;
        //DB에서 해당 id의 취약점 문제 중간종료 여부 검색
        //중간종료 한 적 있으면 거기부터 시작
        params = {
          TableName: "WeakWait",
          Key: {
            "id": id
          }
        };
        docClient.get(params, function (err1, data1) {
          if (err1) {
            //실패
            throw err1
          } else {
            //성공
            if (data1.Item.testNum == 0) {//만약 없다면
              //weakness에서 가장 낮은 type 가져와야 한다.
              params = {
                TableName: "Weakness",
                KeyConditionExpression: "#i = :i",
                ExpressionAttributeNames: {
                  "#i": "id"
                },
                ExpressionAttributeValues: {
                  ":i": id
                }
              };

              docClient.query(params, function (err2, data2) {
                if (err2) {
                  //실패
                  console.error("Unable to query1. Error:", JSON.stringify(err2, null, 2));
                  throw err2
                } else {
                  //성공
                  data2.Items.sort(customSort);
                  getType = data2.Items[0].type;

                  params = {
                    TableName: "Quest",
                    FilterExpression: "type1 = :t or type2 = :t",
                    ExpressionAttributeValues: {
                      ":t": getType
                    }
                  };

                  docClient.scan(params, function (err3, data3) {
                    if (err3) {
                      //실패
                      console.error("Unable to query3. Error:", JSON.stringify(err3, null, 2));
                      throw err3
                    } else {
                      //성공
                      var randomInt = getRandomInt(0, data3.Count - 1);
                      temp = data3.Items[randomInt];

                      testNum = temp.testNum;        //회차번호
                      questionNum = temp.questNum;    //문제번호
                      question = temp.quest;       //문제
                      score = temp.score;          //점수
                      image = temp.image;          //문제 이미지
                      questType1 = temp.type1;     //문제 타입 ex)조선-역사
                      questType2 = temp.type2;     //문제 타입2 없으면 ""
                      isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                      answer1 = temp.answer1;        //지문 1~5
                      answer2 = temp.answer2;
                      answer3 = temp.answer3;
                      answer4 = temp.answer4;
                      answer5 = temp.answer5;
                      answer = temp.answer;         //정답
                      comment = temp.comment;        //해설

                      var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                      image = base64_encode(filePath)
                      if(temp.answer1 == '(사진)') {
                        answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                        answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                        answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                        answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                        answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                      }

                      str = {
                          result : true,

                          testNum : testNum,
                          questionNum : questionNum,
                          question : question,
                          score : score,
                          image : image,
                          questType1 : questType1,
                          questType2 : questType2,
                          isImageQuest : isImageQuest,
                          answer1 : answer1,
                          answer2 : answer2,
                          answer3 : answer3,
                          answer4 : answer4,
                          answer5 : answer5,
                          answer : answer,
                          comment : comment
                      }
                    }
                  });
                }
              });
            } else {//중간 종료가 있다면
              params = {
                TableName: "Quest",
                Key: {
                  "testNum": data1.Item.testNum,
                  "questNum": data1.Item.questNum
                }
              };

              docClient.get(params, function (err2, data2) {
                if (err2) {
                  //실패
                  console.error("Unable to query2. Error:", JSON.stringify(err2, null, 2));
                  throw err2
                } else {
                  //성공
                  testNum = data2.Item.testNum;        //회차번호
                  questionNum = data2.Item.questNum;    //문제번호
                  question = data2.Item.quest;       //문제
                  score = data2.Item.score;          //점수
                  image = data2.Item.image;          //문제 이미지
                  questType1 = data2.Item.type1;     //문제 타입 ex)조선-역사
                  questType2 = data2.Item.type2;     //문제 타입2 없으면 ""
                  isImageQuest = data2.Item.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                  answer1 = data2.Item.answer1;        //지문 1~5
                  answer2 = data2.Item.answer2;
                  answer3 = data2.Item.answer3;
                  answer4 = data2.Item.answer4;
                  answer5 = data2.Item.answer5;
                  answer = data2.Item.answer;         //정답
                  comment = data2.Item.comment;        //해설

                  var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                  image = base64_encode(filePath)
                  if(data2.Item.answer1 == '(사진)') {
                    answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                    answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                    answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                    answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                    answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                  }

                  str = {
                    result : true,
                    testNum : testNum,
                    questionNum : questionNum,
                    question : question,
                    score : score,
                    image : image,
                    questType1 : questType1,
                    questType2 : questType2,
                    isImageQuest : isImageQuest,
                    answer1 : answer1,
                    answer2 : answer2,
                    answer3 : answer3,
                    answer4 : answer4,
                    answer5 : answer5,
                    answer : answer,
                    comment : comment
                  }
                }
              });
            }
          }
        });
        //없으면 취약점 리스트 불러온 다음,
        //가장 취약한 거 선택
        //만약 취약한 거 동급이 여러개일 경우
        //동급인 것들 중 문제를 총 문제풀이 갯수가 낮은 것 선택
        //다 동급이고, 다 갯수도 같으면 그냥 랜덤

        /*
        if(취약점이 부족할 경우) {
            str = {
                result : false,
                errCode : 101
            }
        }
        else {*/
            //해당 취약점으로 문제 하나 랜덤으로 추출.


        //}
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 102}
    }

    await waitAMiddle();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//22. 취약점 문제풀이-2(계속)
server.get("/Weakness/ContinueWeaknessTest", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("ContinueWeaknessTest function is running");
    var str;
    try {
        let id = req.query.id;              //id
        var testNum = req.query.testNum * 1;     //시험 회차
        let questNum = req.query.questNum  * 1;  //문제 번호
        let userAnswer = req.query.answer * 1;   //정답

        function customSort(a, b) {
          if((a.correct / a.solve) == (b.correct / b.solve)) {//정렬
             return 0
           }
           return (a.correct / a.solve) > (b.correct / b.solve) ? 1 : -1;
         }

        //21번에서 사용한 취약 문제 찾기 알고리즘 응용, 한 문제 더 가져오기
        //testNum;            //회차 번호
        var questionNum;    //문제번호
        var question;       //문제
        var score;          //점수
        var image;          //문제 이미지
        var questType1;     //문제 타입 ex)조선-역사
        var questType2;     //문제 타입2 없으면 ""
        var isImageQuest;   //이미지 문제인지 여부. 맞으면 true
        var answer1;        //지문 1~5
        var answer2;
        var answer3;
        var answer4;
        var answer5;
        var answer;         //정답
        var comment;        //해설

        //DB에서 해당 testNum과 questNum이 일치하는 데이터를 찾아서
        //진짜 정답 가져오기
        let realAnswer; //진짜 정답
        params = {
          TableName: "Quest",
          Key: {
            "testNum": testNum,
            "questNum": questNum
          }
        };

        docClient.get(params, function (err1, data1) {
          if (err1) {
            //실패
            console.error("Unable to query1. Error:", JSON.stringify(err1, null, 2));
            throw err1
          } else {
            //성공
            realAnswer = data1.Item.answer;
            if(userAnswer == realAnswer) {
                //취약점 분석에 푼 갯수, 맞은 갯수 추가하기.
                //취약점에 적용할 type이 몇가지 인지 확인해야 한다.
                //우선적으로 type1에 해당하는 weak수정
                params = {
                  TableName: "Weakness",
                  Key: {
                    "id": id,
                    "type": data1.Item.type1
                  },
                  UpdateExpression: "set #s = #s + :s, #c = :c",
                  ExpressionAttributeNames: {
                    "#s": "solve",
                    "#c": "correct"
                  },
                  ExpressionAttributeValues: {
                    ":s": 1,
                    ":c": 1
                  }
                };

                docClient.update(params, function (err2, data2) {
                  if (err2) {
                    //실패
                    console.error("Unable to query2. Error:", JSON.stringify(err2, null, 2));
                    throw err2
                  } else {
                    //성공
                    if (data1.Item.type2 != undefined) {//만약 문제에 type2가 존재한다면
                      params = {
                        TableName: "Weakness",
                        Key: {
                          "id": id,
                          "type": data1.Item.type2
                        },
                        UpdateExpression: "set #s = #s + :s, #c = :c",
                        ExpressionAttributeNames: {
                          "#s": "solve",
                          "#c": "correct"
                        },
                        ExpressionAttributeValues: {
                          ":s": 1,
                          ":c": 1
                        }
                      };
                      docClient.update(params, function (err3, data3) {
                        if (err3) {
                          //실패
                          console.error("Unable to query3. Error:", JSON.stringify(err3, null, 2));
                          throw err3
                        } else {
                          //성공
                          //Weakness 정렬
                          params = {
                            TableName: "Weakness",
                            KeyConditionExpression: "id = :i",
                            ExpressionAttributeValues: {
                              ":i": id
                            }
                          };

                          docClient.query(params, function (err4, data4) {
                            if (err4) {
                              //실패
                              console.error("Unable to query4. Error:", JSON.stringify(err4, null, 2));
                              throw err4
                            } else {
                              //성공
                              data4.Items.sort(customSort);//정렬
                              params = {
                                TableName: "Quest",
                                FilterExpression: "#t1 = :t or #t2 = :t",
                                ExpressionAttributeNames: {
                                  "#t1": "type1",
                                  "#t2": "type2"
                                },
                                ExpressionAttributeValues: {
                                  ":t": data4.Items[0].type
                                }
                              };

                              docClient.scan(params, function (err5, data5) {
                                if (err5) {
                                  //실패
                                  console.error("Unable to query5. Error:", JSON.stringify(err5, null, 2));
                                  throw err5
                                } else {
                                  //성공
                                  var randomInt = getRandomInt(0, data5.Count);
                                  temp = data5.Items[randomInt];

                                  testNum = temp.testNum;            //회차 번호
                                  questionNum = temp.questNum;    //문제번호
                                  question = temp.quest;       //문제
                                  score = temp.score;          //점수
                                  image = temp.image;          //문제 이미지
                                  questType1 = temp.type1;     //문제 타입 ex)조선-역사
                                  questType2 = temp.type2;     //문제 타입2 없으면 ""
                                  isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                                  answer1 = temp.answer1;        //지문 1~5
                                  answer2 = temp.answer2;
                                  answer3 = temp.answer3;
                                  answer4 = temp.answer4;
                                  answer5 = temp.answer5;
                                  answer = temp.answer;         //정답
                                  comment = temp.comment;        //해설

                                  var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                                  image = base64_encode(filePath)
                                  if(temp.answer1 == '(사진)') {
                                    answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                                    answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                                    answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                                    answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                                    answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                                  }

                                  str = {
                                      result : true,

                                      testNum : testNum,
                                      questionNum : questionNum,
                                      question : question,
                                      score : score,
                                      image : image,
                                      questType1 : questType1,
                                      questType2 : questType2,
                                      isImageQuest : isImageQuest,
                                      answer1 : answer1,
                                      answer2 : answer2,
                                      answer3 : answer3,
                                      answer4 : answer4,
                                      answer5 : answer5,
                                      answer : answer,
                                      comment : comment
                                  }
                                }
                              });
                            }
                          });
                          }
                      });
                    } else {//type2가 존재하지 않는다면
                      //Weakness 정렬
                      params = {
                        TableName: "Weakness",
                        KeyConditionExpression: "id = :i",
                        ExpressionAttributeValues: {
                          ":i": id
                        }
                      };

                      docClient.query(params, function (err3, data3) {
                        if (err3) {
                          console.error("Unable to query6. Error:", JSON.stringify(err3, null, 2));
                          throw err3
                          //실패
                        } else {
                          //성공
                          data3.Items.sort(customSort);//정렬
                          params = {
                            TableName: "Quest",
                            FilterExpression: "#t1 = :t or #t2 = :t",
                            ExpressionAttributeNames: {
                              "#t1": "type1",
                              "#t2": "type2"
                            },
                            ExpressionAttributeValues: {
                              ":t": data3.Items[0].type
                            }
                          };

                          docClient.scan(params, function (err4, data4) {
                            if (err4) {
                              //실패
                              console.error("Unable to query7. Error:", JSON.stringify(err4, null, 2));
                              throw err4
                            } else {
                              //성공                              
                              var randomInt = getRandomInt(0, data4.Count);
                              temp = data4.Items[randomInt];

                              testNum = temp.testNum;            //회차 번호
                              questionNum = temp.questNum;    //문제번호
                              question = temp.quest;       //문제
                              score = temp.score;          //점수
                              image = temp.image;          //문제 이미지
                              questType1 = temp.type1;     //문제 타입 ex)조선-역사
                              questType2 = temp.type2;     //문제 타입2 없으면 ""
                              isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                              answer1 = temp.answer1;        //지문 1~5
                              answer2 = temp.answer2;
                              answer3 = temp.answer3;
                              answer4 = temp.answer4;
                              answer5 = temp.answer5;
                              answer = temp.answer;         //정답
                              comment = temp.comment;        //해설

                              var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                              image = base64_encode(filePath)
                              if(temp.answer1 == '(사진)') {
                                answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                                answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                                answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                                answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                                answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                              }

                              str = {
                                  result : true,

                                  testNum : testNum,
                                  questionNum : questionNum,
                                  question : question,
                                  score : score,
                                  image : image,
                                  questType1 : questType1,
                                  questType2 : questType2,
                                  isImageQuest : isImageQuest,
                                  answer1 : answer1,
                                  answer2 : answer2,
                                  answer3 : answer3,
                                  answer4 : answer4,
                                  answer5 : answer5,
                                  answer : answer,
                                  comment : comment
                              }
                            }
                          });
                        }
                      });
                    }

                  }
                });
            }
            else {
                //취약점 분석에 푼 갯수만 추가하기.
                //취약점에 적용할 type이 몇가지 인지 확인해야 한다.
                //우선적으로 type1에 해당하는 weak수정
                params = {
                  TableName: "Weakness",
                  Key: {
                    "id": id,
                    "type": data1.Item.type1
                  },
                  UpdateExpression: "set #s = #s + :s",
                  ExpressionAttributeNames: {
                    "#s": "solve"
                  },
                  ExpressionAttributeValues: {
                    ":s": 1
                  }
                };

                docClient.update(params, function (err2, data2) {
                  if (err2) {
                    //실패
                    console.error("Unable to query8. Error:", JSON.stringify(err2, null, 2));
                    throw err2
                  } else {
                    //성공
                    if (data1.Item.type2 != undefined) {//만약 문제의 타입이 복수로 존재한다면
                      params = {
                        TableName: "Weakness",
                        Key: {
                          "id": id,
                          "type": data1.Item.type2
                        },
                        UpdateExpression: "set #s = #s + :s",
                        ExpressionAttributeNames: {
                          "#s": "solve"
                        },
                        ExpressionAttributeValues: {
                          ":s": 1
                        }
                      };
                      docClient.update(params, function (err3, data3) {
                        if (err3) {
                          //실패
                          console.error("Unable to query9. Error:", JSON.stringify(err3, null, 2));
                          throw err3
                        } else {
                          //성공
                          //Weakness 정렬
                          params = {
                            TableName: "Weakness",
                            KeyConditionExpression: "id = :i",
                            ExpressionAttributeValues: {
                              ":i": id
                            }
                          };

                          docClient.query(params, function (err4, data4) {
                            if (err4) {
                              //실패
                              console.error("Unable to query10. Error:", JSON.stringify(err4, null, 2));
                              throw err4
                            } else {
                              //성공
                              data4.Items.sort(customSort);//정렬
                              params = {
                                TableName: "Quest",
                                FilterExpression: "#t1 = :t or #t2 = :t",
                                ExpressionAttributeNames: {
                                  "#t1": "type1",
                                  "#t2": "type2"
                                },
                                ExpressionAttributeValues: {
                                  ":t": data4.Items[0].type
                                }
                              };

                              docClient.scan(params, function (err5, data5) {
                                if (err5) {
                                  //실패
                                  console.error("Unable to query11. Error:", JSON.stringify(err5, null, 2));
                                  throw err5
                                } else {
                                  //성공
                                  var randomInt = getRandomInt(0, data5.Count);
                                  temp = data5.Items[randomInt];

                                  testNum = temp.testNum;            //회차 번호
                                  questionNum = temp.questNum;    //문제번호
                                  question = temp.quest;       //문제
                                  score = temp.score;          //점수
                                  image = temp.image;          //문제 이미지
                                  questType1 = temp.type1;     //문제 타입 ex)조선-역사
                                  questType2 = temp.type2;     //문제 타입2 없으면 ""
                                  isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                                  answer1 = temp.answer1;        //지문 1~5
                                  answer2 = temp.answer2;
                                  answer3 = temp.answer3;
                                  answer4 = temp.answer4;
                                  answer5 = temp.answer5;
                                  answer = temp.answer;         //정답
                                  comment = temp.comment;        //해설

                                  var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                                  image = base64_encode(filePath)
                                  if(temp.answer1 == '(사진)') {
                                  answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                                  answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                                  answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                                  answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                                  answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                                  }

                                  str = {
                                      result : true,

                                      testNum : testNum,
                                      questionNum : questionNum,
                                      question : question,
                                      score : score,
                                      image : image,
                                      questType1 : questType1,
                                      questType2 : questType2,
                                      isImageQuest : isImageQuest,
                                      answer1 : answer1,
                                      answer2 : answer2,
                                      answer3 : answer3,
                                      answer4 : answer4,
                                      answer5 : answer5,
                                      answer : answer,
                                      comment : comment
                                  }
                                }
                              });
                            }
                          });
                          }
                      });
                    } else {//type2가 존재하지 않는다면
                      //Weakness 정렬
                      params = {
                        TableName: "Weakness",
                        KeyConditionExpression: "id = :i",
                        ExpressionAttributeValues: {
                          ":i": id
                        }
                      };

                      docClient.query(params, function (err3, data6) {
                        if (err3) {
                          //실패
                          console.error("Unable to query12. Error:", JSON.stringify(err3, null, 2));
                          throw err3
                        } else {
                          //성공
                          data6.Items.sort(customSort);//정렬
                          params = {
                            TableName: "Quest",
                            FilterExpression: "#t1 = :t or #t2 = :t",
                            ExpressionAttributeNames: {
                              "#t1": "type1",
                              "#t2": "type2"
                            },
                            ExpressionAttributeValues: {
                              ":t": data6.Items[0].type
                            }
                          };

                          docClient.scan(params, function (err4, data7) {
                            if (err4) {
                              //실패
                              console.error("Unable to query13. Error:", JSON.stringify(err4, null, 2));
                              throw err4
                            } else {
                              //성공
                              var randomInt = getRandomInt(0, data7.Count);
                              temp = data7.Items[randomInt];

                              testNum = temp.testNum;            //회차 번호
                              questionNum = temp.questNum;    //문제번호
                              question = temp.quest;       //문제
                              score = temp.score;          //점수
                              image = temp.image;          //문제 이미지
                              questType1 = temp.type1;     //문제 타입 ex)조선-역사
                              questType2 = temp.type2;     //문제 타입2 없으면 ""
                              isImageQuest = temp.isImageQuest;   //이미지 문제인지 여부. 맞으면 true
                              answer1 = temp.answer1;        //지문 1~5
                              answer2 = temp.answer2;
                              answer3 = temp.answer3;
                              answer4 = temp.answer4;
                              answer5 = temp.answer5;
                              answer = temp.answer;         //정답
                              comment = temp.comment;        //해설

                              var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
                              image = base64_encode(filePath)
                              if(temp.answer1 == '(사진)') {
                                answer1 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-1.jpg")
                                answer2 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-2.jpg")
                                answer3 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-3.jpg")
                                answer4 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-4.jpg")
                                answer5 = base64_encode("한국사/" + testNum + "회/" + questionNum + "-5.jpg")
                              }

                              str = {
                                  result : true,

                                  testNum : testNum,
                                  questionNum : questionNum,
                                  question : question,
                                  score : score,
                                  image : image,
                                  questType1 : questType1,
                                  questType2 : questType2,
                                  isImageQuest : isImageQuest,
                                  answer1 : answer1,
                                  answer2 : answer2,
                                  answer3 : answer3,
                                  answer4 : answer4,
                                  answer5 : answer5,
                                  answer : answer,
                                  comment : comment
                              }
                            }
                          });
                        }
                      });
                    }
                  }
                });
            }
          }
        });
    }
    catch(e) {
        console.log(e)
        //기타 에러
        str = {result : false, errCode : 101}
    }

    await waitAMiddle();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})

//23. 취약점 문제풀이_종료
server.get("/Weakness/ExitWeaknessTest", async(req,res) => {
    console.log(requestIP.getClientIp(req));
    console.log("ExitWeaknessTest function is running");
    var str = {result : true};
    try{
        let id = req.query.id;              //id
        let testNum = req.query.testNum  * 1;    //시험 회차

        let questNum = req.query.questNum  * 1;  //문제 번호

        params = {
          TableName: "WeakWait",
          Key: {
            "id": id
          },
          UpdateExpression: "set #t = :t , #q = :q",
          ExpressionAttributeNames: {
            "#t": "testNum",
            "#q": "questNum"
          },
          ExpressionAttributeValues: {
            ":t": testNum,
            ":q": questNum
          }
        };
        docClient.update(params, function (err, data) {
          if (err) {
            //실패
            throw err
          } else {
            //성공
          }
        });
        //현재 상태 저장하셈.
    }
    catch(e) {
        console.log(e)
        str = {result : false, errCode : 101}
    }
    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str)
})

//번외.평균 점수 가져오기 //끝
server.get("/getAverageScore", async(req,res) => {
    console.log("getAverageScore function is running");
    var str;
    try {
        let id = req.query.id;      //id
        //해당 아이디로 회원정보에 있는 스코어 검색
        var score;

        params = {
          TableName: "User",
          Key: {
            "id": id
          }
        };
        docClient.get(params, function (err, data) {
          if (err) {
            //실패
            throw err
          } else {
            //성공
            score = data.Item.averageScore;
            str = {result : true, score : score}
          }
        });
    }
    catch(e) {
        console.log(e)
        str = {result : false, errCode : 101}
    }
    await waitASecond();
    console.log(str)
    console.log("결과출력");
    res.json(str);
})


server.get("/testServer", async(req,res) => {
    //연습용
    console.log("zz")
    testNum = 40
    questNum = 50
    var filePath = "한국사/" + testNum + "회/" + questionNum + ".jpg";
    console.log(base64_encode(filePath))
})

server.listen(3294,() => {
    console.log('the server is running ON 3294');
})
