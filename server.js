const express = require('express');
const server = express();

//회원 정보 관련 기능
//1. 회원가입
server.get("/UserFunction/Register", (req,res) => {
    console.log("register function is running");
    var str = { result : true } //결과값
    try {
        let id = req.query.id;              //id
        let userName = req.query.userName;  //이름
        let password = req.query.password;  //비밀번호
        let averageScore = 0;               //평균점수 처음에는 0으로 초기화
        
        //DB에 위의 정보로 한 명 추가해줘
        //그리고 회차목록에 해당 id로 모든 회차 엔티티 추가해야 할거야. 무슨 말인지 이해 안되면 연락줘

        //그리고 만약 에러가 발생하면, 각 에러에 따라 밑의 주석 지워서 코드 추가하면 돼
        //만약 존재하는 아이디일 경우
        //str = {result : false, errCode : 101}
    }
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 102}
    }

    res.json(str)
})

//2. 로그인
server.get("/UserFinction/LogIn", (req,res) => {
    console.log("login function is running");
    var str = {result : true}
    try {
        let id = req.query.id;
        let password = req.query.password;

        //DB에 위의 아이디가 있는지, 혹은 비밀번호가 맞지 않는지 검사
        //존재하지 않는 아이디
        //str = {result : false, errCode : 101}
        //비밀번호 오류
        //str = {result : false, errCode : 102}
    }
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 103}
    }

    res.json(str)
})

//3. 회원정보 수정
server.get("/UserFunction/EditInfo", (req,res) => {
    console.log("editinfo function is running");
    var str = {result : true}
    try {
        let id = req.query.id;              //id
        let userName = req.query.userName;  //이름
        let password = req.query.password;  //원래 비밀번호
        let newPassword = req.query.password; //새로운 비밀번호

        //DB에서 해당 정보 수정
        //원래 비밀번호가 맞지 않을 경우
        //str = {result : false, errCode : 101}
    }
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 102}
    }

    res.json(str)
})

//4. 회원탈퇴
server.get("/UserFunction/UnRegister", (req,res) => {
    console.log("unregister function is running");
    var str = {result : true}
    try {
        let id = req.query.id;              //id
        let password = req.query.password;  //비밀번호
        //DB에서 해당 사용자 정보 삭제
        //비밀번호가 일치하지 않을 경우
        //str = {result : false, errCode : 101}
    }
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 102}
    }

    res.json(str);
})

//문제풀기 기능
//5. 회차리스트 로딩
server.get("/DoTest/LoadTestList", (req,res) => {
    console.log("loadtestlist function is running");
    var str = {result : true}
    try {
        let id = req.query.id;              //id
        //DB에서 해당 id로 회차목록 전체 조회
        //회원가입에도 명시했는데, 회원가입할 때 다 만들어져 있어야해.
    }
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 101}
    }

    res.json(str);
})
//6. 회차별 문제풀이-1(시작)
server.get("/DoTest/StartTestByNum", (req,res) => {
    console.log("startTestByNum function is running");
    var str;
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        //DB에서 해당 id와 회차에서 문제번호(중간종료여부) 검색

        //그런데 만약 문제번호가 51(이미 종료)일 경우에는
        var questionNum;
        if(questionNum == 51) {
        //문제번호를 0으로 바꾸고, 회차별 오답 테이블 삭제해버려
        //무슨 말인지 알지?
        }

        //0이면 1번, 아니면 해당 문제번호 뽑아와
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
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 101}
    }

    res.json(str);
})
//7. 회차별 문제풀이-2(계속)
server.get("/DoTest/ContinueTestByNum", (req,res) => {
    console.log("continueTestByNum function is running");
    var str;
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호
        let userAnswer = req.query.answer   //정답

        //DB에서 해당 testNum과 questNum이 일치하는 데이터를 찾아서
        //점수와 진짜 정답 가져오기
        let realAnswer; //진짜 정답
        let questScore;      //점수
        if(userAnswer == realAnswer) {
            //score만큼 해당 아이디의 회차 점수에 추가하기
            //ex) 기존 10, 해당 문제 점수 3 => 13으로 갱신
            //취약점 분석에 푼 갯수, 맞은 갯수 추가하기.
        }
        else {
            //회차별 오답 리스트에 해당 문제 추가하기
            //취약점 분석에 푼 갯수만 추가하기.
        }


        //파라미터로 입력받은 questNum의 다음 문제 뽑아와.
        //만약 questNum이 10이면, 11번 문제 뽑아오면 돼

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
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 101}
    }

    res.json(str);
})
//8. 회차별 문제풀이-3(최종종료)
server.get("/DoTest/FinishTestByNum", (req,res) => {
    console.log("finishTestByNum function is running");
    var str;
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호
        let userAnswer = req.query.answer   //정답

        //DB에서 해당 testNum과 questNum이 일치하는 데이터를 찾아서
        //점수와 진짜 정답 가져오기
        let realAnswer; //진짜 정답
        let questScore;      //점수
        if(userAnswer == realAnswer) {
            //score만큼 해당 아이디의 회차 점수에 추가하기
            //ex) 기존 10, 해당 문제 점수 3 => 13으로 갱신
        }
        else {
            //회차별 오답 리스트에 해당 문제 추가하기
        }
        //여기서 할 건 두 가지인데
        //1. 회차에서 최종점수 뽑아와
        var finalScore;     //최종점수
        //이 최종점수를 회차 테이블의 점수에 저장해.
        //그리고 모든 회차 테이블을 돌면서 푼 점수들의 평균을 낸 다음에,
        //그 평균을 사용자 테이블 평균 점수에 저장해야 해.
        //좀 많다. 힘내 ㅠㅠ

        //2. 오답 리스트 다 가져와
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

        str = [
            result = 
            {
                result : true,
                finalScore : finalScore
            },
            //여기가 중요한데, jsonArray 형식으로 틀린 것들을 전부
            //뽑아줘야 해. 구글링 잘 하면서 해봐. 화이팅...ㅠㅠ
            wrongQuestions = [
            {
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
            }]
        ]
    }
    catch(e) {
        //기타 에러
        str = [
            result = 
            {
                result : false,
                errCode : 101
            }
            ]
    }

    res.json(str);
})
//9. 회차별 문제풀이-4(중간종료)
server.get("/DoTest/StopTestByNum", (req,res) => {
    console.log("stopTestByNum function is running");
    var str = {resulut : true};
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호

        //해당 회차-문제 번호를 저장해주면 돼.
    }
    catch(e) {
        //기타 에러
        str ={
                result : false,
                errCode : 101
            }
    }

    res.json(str);
})
//10. 랜덤 문제풀이-1(시작)
server.get("/DoTest/StartRandomTest", (req,res) => {
    console.log("StartRandomTest function is running");
    var str;
    try {
        let id = req.query.id;              //id
        //DB에서 해당 id의 랜덤 문제 중간종료 여부 검색
        //중간종료 한 적 있으면 거기부터 시작
        //없으면 아무 문제 하나만 랜덤으로 가져와

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
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 101}
    }

    res.json(str);
})
//11. 랜덤 문제풀이-2(계속)
server.get("/DoTest/ContinueRandomTest", (req,res) => {
    console.log("ContinueRandomTest function is running");
    var str;
    try {
        let id = req.query.id;              //id
        var testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호
        let userAnswer = req.query.answer   //정답

        //DB에서 해당 testNum과 questNum이 일치하는 데이터를 찾아서
        //진짜 정답 가져오기
        let realAnswer; //진짜 정답
        if(userAnswer == realAnswer) {
            //취약점 분석에 푼 갯수, 맞은 갯수 추가하기.
        }
        else {
            //취약점 분석에 푼 갯수만 추가하기.
        }


        //다음으로 아무문제 랜덤으로 하나만 뽑아와.

        testNum;        //회차번호
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
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 101}
    }

    res.json(str);
})
//12. 랜덤 문제풀이-3(중간종료)
server.get("/DoTest/StopRandomTest", (req,res) => {
    console.log("StopRandomTest function is running");
    var str = {resulut : true};
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호
        
        //해당 회차-문제 번호를 저장해주면 돼.
    }
    catch(e) {
        //기타 에러
        str ={
                result : false,
                errCode : 101
            }
    }

    res.json(str);
})
//13. 빈칸 맞추기는 나중에 합시다. 생각좀 해보게

//3. 오답노트
//14. 오답노트 저장_1 한 문제
server.get("/Ohdob/SaveQuestion", (req, res) => {
    console.log("SaveQuestion function is running");
    var str = {resulut : true};
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호
        
        //해당 회차-문제 번호를 오답노트에 저장해주면 돼
        //그런데 만약 저장된 문제일 경우?
        //var str = {result : false, errCode : 101};
    }
    catch(e) {
        //기타 에러
        str ={
                result : false,
                errCode : 102
            }
    }
    res.json(str);
})
//15. 오답노트 저장_2 여러 문제
server.get("/Ohdob/SaveQuestions", (req, res) => {
    console.log("SaveQuestions function is running");
    var str = {resulut : true};
    try {
        let id = req.query.id;              //id
        let i = 0;
        while(true) {
            eval("var testNum" + i + "=req.query.testNum" + i)
            if(eval("testNum" + i) == undefined) break;
            eval("var questNum" + i + "=req.query.questNum" + i)
            i++;
        }
        for(var j = 0; j<i; j++) {
            //하나씩 저장
            //불러올 때는 변수명 대신 eval("testNum" + j) 이렇게 하는거야.
            //ex) testNum0 이런거 대신 위에꺼 쓰라는 말임.
        }
    }
    catch(e) {
        //기타 에러
        str ={
                result : false,
                errCode : 101
            }
    }
    res.json(str);
})
//16. 오답노트 전체조회
server.get("/Ohdob/GetSaveQuestion", (req, res) => {
    console.log("GetSaveQuestion function is running");
    var str;
    try {
        let id = req.query.id;              //id
        //해당 아이디에 저장된 모든 오답노트를 불러와야 됨.

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

        /*
        if(true) {
            //저장된 오답노트가 없으면?
            //str = [
                result = 
                {
                    result : false,
                    errCode : 101
                }]
        }
        */
        //else {
           //저장된 오답노트가 있으면 
            str = [
                result = 
                {
                    result : true,
                    finalScore : finalScore
                },
                //여기가 중요한데, jsonArray 형식으로 틀린 것들을 전부
                //뽑아줘야 해. 구글링 잘 하면서 해봐. 화이팅...ㅠㅠ
                wrongQuestions = [
                {
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
                }]
            ]
        //}
    }
    catch(e) {
        //기타 에러
        str = [
            result = 
            {
                result : false,
                errCode : 102
            }
            ]
    }
})
//17. 오답노트 삭제
server.get("/Ohdob/DeleteQuestion", (req, res) => {
    console.log("DeleteQuestion function is running");
    var str = {resulut : true};
    try {
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호
        
        //해당 회차-문제 번호를 오답노트에서 삭제하면 됨
    }
    catch(e) {
        //기타 에러
        str ={
                result : false,
                errCode : 101
            }
    }
    res.json(str);
})
//18. 오답노트 랜덤 풀이
server.get("/Ohdob/DoOhdobTest", (req,res) => {
    console.log("DoOhdobTest function is running");
    var str;
    try {
        let id = req.query.id;              //id
        //DB에서 해당 id의 랜덤 문제 중간종료 여부 검색
        //중간종료 한 적 있으면 거기부터 시작
        //그리고 오답노트 풀이 같은 경우는 다른 문제풀이랑 달리
        //시작 - 계속 으로 나뉘지 않고 계속 시작 이거든?
        //그러니까 중간종료 이력 삭제나 초기화 해야해.
        //안그러면 같은 문제만 계속 나옴 

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

        /*
        if (저장된 오답노트가 없다면) {
            str = { result : false, errCode : 101};
        }
        else {
        */
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
        //}
    }
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 102}
    }

    res.json(str);
})
//19. 오답노트 랜덤 풀이 종료
server.get("/Ohdob/ExitOhdobTest", (req,res) => {
    console.log("ExitOhDobTest function is running");
    var str = {result : true};
    try{
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호

        //현재 상태 저장하셈.
    }
    catch(e) {
        str = {result : false, errCode : 101}
    }
    res.json(str)
})

//4. 취약점 분석
//20. 취약점 리스트 조회
server.get("/Weakness/GetMyWeakness", (req, res) => {
    console.log("GetMyWeakness function is running");
    var str;
    try {
        let id = req.query.id;              //id
        //해당 아이디에 저장된 취약점들을 불러와야 해.
        var questType;      //문제 분류
        var solvedQuests;   //푼 총 문제 갯수
        var answerQuests;   //정답인 문제 갯수
        var videoURL;       //추천 동영상 강의

        /*if(모든 분류에 대해 다섯 문제 이상씩 데이터가 안쌓였으면) {
        str = [
            result = {
                result : false,
                errCode : 101
            }
        ]
        }
        */
       //else {
           // (answerQuests / solvedQuests)가 낮은 순으로 불러와줘.
            str = [
                result = {
                    result : true
                },
                weaknesses = [
                    {
                        questType : questType,
                        solvedQuests = solvedQuests,
                        answerQuests = answerQuests,
                        videoURL = videoURL
                    }
                ]
            ]
       //}
    }
    catch(e) {
        //기타 에러
        str = [
            result = 
            {
                result : false,
                errCode : 102
            }
            ]
    }
    res.json(str);
})
//21. 취약점 문제풀이_시작
server.get("/Weakness/StartWeaknessTest", (req,res) => {
    console.log("StartWeaknessTest function is running");
    var str;
    try {
        let id = req.query.id;              //id
        //DB에서 해당 id의 취약점 문제 중간종료 여부 검색
        //중간종료 한 적 있으면 거기부터 시작
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
        //}
    }
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 102}
    }

    res.json(str);
})
//22. 랜덤 문제풀이-2(계속)
server.get("/Weakness/ContinueWeaknessTest", (req,res) => {
    console.log("ContinueWeaknessTest function is running");
    var str;
    try {
        let id = req.query.id;              //id
        var testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호
        let userAnswer = req.query.answer   //정답

        //DB에서 해당 testNum과 questNum이 일치하는 데이터를 찾아서
        //진짜 정답 가져오기
        let realAnswer; //진짜 정답
        if(userAnswer == realAnswer) {
            //취약점 분석에 푼 갯수, 맞은 갯수 추가하기.
        }
        else {
            //취약점 분석에 푼 갯수만 추가하기.
        }

        //21번에서 사용한 취약 문제 찾기 알고리즘 응용, 한 문제 더 가져오기
        testNum;            //회차 번호
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
    catch(e) {
        //기타 에러
        str = {result : false, errCode : 101}
    }

    res.json(str);
})
//23. 취약점 문제풀이_종료
server.get("/Weakness/ExitWeaknessTest", (req,res) => {
    console.log("ExitWeaknessTest function is running");
    var str = {result : true};
    try{
        let id = req.query.id;              //id
        let testNum = req.query.testNum     //시험 회차
        let questNum = req.query.questNum   //문제 번호

        //현재 상태 저장하셈.
    }
    catch(e) {
        str = {result : false, errCode : 101}
    }
    res.json(str)
})

//번외.평균 점수 가져오기
server.get("/getAverageScore", (req,res) => {
    console.log("getAverageScore function is running");
    var str;
    try {
        let id = req.query.id;      //id
        //해당 아이디로 회원정보에 있는 스코어 검색
        var score;
        str = {result : true, score : score}
    }
    catch(e) {
        str = {result : false, errCode : 101}
    }
    res.json(str);
})


server.get("/testServer", (req,res) => {
    //연습용
    var id = "123okk2"
    var pw = "okk1232"
    str = {
        result : true,
        id : id,
        pw : pw
        
    }

    /*
    let id = req.query.id;              //id
    console.log(id);
    let i = 0;
    while(true) {
        eval("var testNum" + i + "=req.query.testNum" + i)
        if(eval("testNum" + i) == undefined) break;
        eval("var questNum" + i + "=req.query.questNum" + i)
        i++;
    }
    for(var j=0; j<i; j++) {
        console.log(eval("testNum" + j));
    }
    */
})

server.listen(3500,() => {
    console.log('the server is running');
})