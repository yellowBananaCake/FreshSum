import "./Report.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";


export const Report = () => {
  const [token] = useContext(UserContext)
  const navigate = useNavigate()

  const [reportBegin, setReportBegin] = useState(new Date().toISOString().split('T')[0])
  const [reportEnd, setReportEnd] = useState(new Date().toISOString().split('T')[0])
  const [report, setReport] = useState([])
  const [reportReady, setReportReady] = useState(false)
  const [totalCalories, setTotalCalories] = useState(0)
  const [totalProts, setTotalProts] = useState(0)
  const [totalFats, setTotalFats] = useState(0)
  const [totalCarbs, setTotalCarbs] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reportBegin > reportEnd) {
      alert("Начальная дата не может быть больше конечной");
      return;
    }
    submitReport();
  }

  const submitReport = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ start_date: reportBegin, end_date: reportEnd })
    };
    const response = await fetch("/api/report", requestOptions);
    if (response.ok) {
      const data = await response.json()
      let _totalCalories = 0, _totalCarbs = 0, _totalFats = 0, _totalProts = 0;

      console.log(data, totalCalories)

      let responceArray = []
      for (let i in data) {
        responceArray.push(data[i])
        _totalCalories += data[i]['calories']
        _totalCarbs += data[i]['carbs']
        _totalFats += data[i]['fats']
        _totalProts += data[i]['proteins']
      }
      setTotalCalories(_totalCalories);
      setTotalCarbs(_totalCarbs);
      setTotalFats(_totalFats);
      setTotalProts(_totalProts);

      setReport(responceArray)
      setReportReady(true)
    } else {
      alert("Проверьте правильность данных")
    }
  };


  return (
    <div>
      <form class="reportForm; form-select; block" onSubmit={handleSubmit}>
        <div class="block"><h2>Отчёт</h2></div>
        <div class="block">
          Дата начала отчётного периода <input
            onChange={e => setReportBegin(e.target.value)}
            defaultValue={reportBegin}
            onBlur={e => { }}
            name="reportBegin"
            className="reportFormInput"
            type="date"
            required
          />
        </div>
        <div class="block">
          Дата окончания отчётного периода <input
            onChange={e => setReportEnd(e.target.value)}
            defaultValue={reportEnd}
            onBlur={e => { }}
            name="reportEnd"
            className="reportFormInput"
            type="date"
            required
          />
        </div>
        <div class="block">
          <button class="blackBtn btn btn-outline-primary btn-sm" type="submit">
            Получить отчёт
          </button>
        </div>
      </form>
      {reportReady && (
        <div class="block">
          <table class="table table-hover">
            <thead >
              <tr>
                <td>Название</td>
                <td>Вес, г</td>
                <td>Калории</td>
                <td>Белки</td>
                <td>Жиры</td>
                <td>Углеводы</td>
                <td>Дата</td>
              </tr>
            </thead>
            <tbody>
              {report.map(prod => (
                <tr>
                  <td>{prod.name}</td>
                  <td>{prod.amount}</td>
                  <td>{prod.calories}</td>
                  <td>{prod.proteins}</td>
                  <td>{prod.fats}</td>
                  <td>{prod.carbs}</td>
                  <td>{prod.date.split("T")[0].split("-").reverse().join(".")}</td>
                </tr>
              ))}
              <tr class="table-warning">
                <td>Итого</td>
                <td></td>
                <td>{totalCalories}</td>
                <td>{totalProts}</td>
                <td>{totalFats}</td>
                <td>{totalCarbs}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Report;
