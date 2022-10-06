var {question, question_answer : answer} = require('./data_quiz');
const userroom = require("./class_room");

const BREAK_DUR_TIME = 3999; // 퀴즈와 퀴즈 사이의 대기 시간    (ms)
const QUIZ_DUR_TIME = 5999; // 문제 출력 후 퀴즈 진행 시간      (ms)
const CHECK_DUR_TIME = 999; // 퀴즈를 풀고 난 뒤 정답 체크 시간  (ms)
const quiz_num = [1, 2]; //문제 수
module.exports = (io, socket, room) => {

  function random_quiz(ms, Index) {
    var quiz_index = Math.floor(Math.random() * question.length);
    while(true) {
      if(room[Index].cur_quiz_index.includes(quiz_index))
      {
        quiz_index = Math.floor(Math.random() * question.length);
      }
      else if(!(room[Index].cur_quiz_index.includes(quiz_index))){
        if(ms == 3999) {
          return answer[quiz_index];
        }
        if (ms == 999) {
          room[Index].cur_quiz_index.push(quiz_index);
          return question[quiz_index];
        }
      }
    }
  }
  
  const oxcycle = (ms, Index)=>{
    return new Promise((resolve, reject)=> {
      setTimeout(()=>{
        if(ms == 5999)      {
          io.to(room[Index].roomCode).emit('ox_checking', { check_time: 1 });
          resolve(ms);
        }
        else if(ms == 3999) {
          io.to(room[Index].roomCode).emit('ox_during', {during_time : 6, _answer : random_quiz(ms, Index)});
          resolve(ms);
        }
        else if(ms == 999)  {
          io.to(room[Index].roomCode).emit('ox_breaking', {break_time : 4, _question : random_quiz(ms, Index)});
          resolve(ms);
        }
      },ms);
    })
  };

  const cycle = async (Index) => {
    console.log(`퀴즈 체크 배열1 : ${room[Index].cur_quiz_index.length}`);
    if(room[Index].cur_quiz_index.length <= quiz_num.length) {
      const isbreak = await oxcycle(BREAK_DUR_TIME, Index)
      console.log(`퀴즈 체크 배열2 : ${room[Index].cur_quiz_index.length}`);
      const isduring = await oxcycle(QUIZ_DUR_TIME, Index)
      console.log(`퀴즈 체크 배열3 : ${room[Index].cur_quiz_index.length}`);
      const ischeck = await oxcycle(CHECK_DUR_TIME, Index)
    }else io.to(room[Index].roomCode).emit('ox_end')
  };

  const quiz_cycle = async (Index) => {
    console.log('퀴즈 사이클 진입');
    for await (var value of quiz_num) { // 2번돔
      console.log('for await of 진입');
      await cycle(Index);
      console.log(`퀴즈 사이클 실행 횟수 : ${ value }`);
    } await cycle(Index); // 마지막 사이클
  }

  socket.on('쥰비완료쓰', (id)=>{
    let Index = room.findIndex(e => e.userid.includes(id));
    if (Index !== -1) {
      room[Index].cnt += 1;
      if(room[Index].cnt == room[Index].players.length) {
          io.to(room[Index].roomCode).emit('ox_breaking', {break_time : 4, _question : random_quiz(999, Index)});
        quiz_cycle(Index);
        room[Index].cnt = 0;
      }
    }
  })
}



