const express = require('express');
const app = express();
app.use(express.json());

let trades = [];

// 거래 추가
app.post('/add-trade', (req, res) => {
    const { action, quantity, price } = req.body;
    const total = quantity * price;
    const supplyPrice = total * 1.1;  // 공급가액 계산
    trades.push({ action, quantity, price, total, supplyPrice, status: "Active" });
    res.send({ message: '거래가 추가되었습니다.', trade: { action, quantity, price, total, supplyPrice } });
});

// 모든 거래 조회
app.get('/trades', (req, res) => {
    res.send(trades);
});

// 특정 거래 수정
app.put('/update-trade/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < trades.length) {
        const { action, quantity, price } = req.body;
        const total = quantity * price;
        const supplyPrice = total * 1.1;  // 공급가액 재계산
        trades[index] = { ...trades[index], action, quantity, price, total, supplyPrice };
        res.send({ message: '거래가 수정되었습니다.', trade: trades[index] });
    } else {
        res.status(404).send({ message: '거래를 찾을 수 없습니다.' });
    }
});

// 특정 거래 삭제
app.delete('/delete-trade/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < trades.length) {
        const removedTrade = trades.splice(index, 1);
        res.send({ message: '거래가 삭제되었습니다.', trade: removedTrade[0] });
    } else {
        res.status(404).send({ message: '거래를 찾을 수 없습니다.' });
    }
});

// 특정 거래 지연 상태 변경
app.put('/delay-trade/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < trades.length) {
        trades[index].status = trades[index].status === "Active" ? "Delayed" : "Active";
        res.send({ message: '거래 지연 상태가 변경되었습니다.', trade: trades[index] });
    } else {
        res.status(404).send({ message: '거래를 찾을 수 없습니다.' });
    }
});

app.listen(3000, () => {
    console.log('서버가 3000 포트에서 실행 중입니다.');
});
