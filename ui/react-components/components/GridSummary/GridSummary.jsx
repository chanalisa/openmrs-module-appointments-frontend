import React from "react";
import { injectIntl } from "react-intl";
import "./GridSummary.module.scss";
import moment from "moment";
import { sortBy } from "lodash";
import classNames from 'classnames'

const transformGridData=(gridData)=>{
  return gridData.map(dataElement => {
    let rowList = [];
    for (let element in dataElement.appointmentCountMap) {
      rowList.push({
        date: element,
        count: dataElement.appointmentCountMap[element].allAppointmentsCount,
        missedCount:
          dataElement.appointmentCountMap[element].missedAppointmentsCount
      });
    }
    return {
      rowLabel: dataElement.appointmentService.name,
      rowDataList: sortBy(rowList, dateObj => moment(dateObj.date))
    };
  });
}

const GridSummary = props => {
  const { gridData=[], weekStartDate = moment().startOf("isoweek"), onClick } = props;
  let week = []
  const gridSummaryData=transformGridData(gridData)

  return (
    <div className="table-grid-wrapper">
      <table className="table-grid-summary">
        <thead>
          <tr>
            <td></td>
            {[...Array(7).keys()].map(index => {
              week.push({
                date: moment(moment(weekStartDate).add(index, "days")).format(
                  "YYYY-MM-DD"
                ),
                totalCount: 0,
                missedCount: 0
              });
              return (
                <td key={'caption'+index}>
                  {moment(moment(weekStartDate).add(index, "days")).format(
                    "D MMM, ddd"
                  )}{" "}
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {gridSummaryData.map((row,index) => {
            return (
              <tr data-testid='row' key={'row'+index}>
                <td key={row.rowLabel+index}>{row.rowLabel}</td>
                {week.map((weekDay,index) => {
                  const a = row.rowDataList.find(
                    ele => ele.date === weekDay.date
                  );
                    let currentDate=weekDay.date===moment().format("YYYY-MM-DD")
                  if (a) {
                    weekDay.totalCount += a.count;
                    weekDay.missedCount += a.missedCount;
                    return (
                      <td key={row.rowLabel+index+weekDay.date} className={classNames({'current-date-column':currentDate})}>
                        <a onClick={() => onClick(weekDay.date)}>{a.count}</a>
                        <span className="missed-count">
                          {a.missedCount > 0
                            ? " (" + a.missedCount + " missed)"
                            : ""}
                        </span>
                      </td>
                    );
                  } else {
                    return <td key={row.rowLabel+index+weekDay.date} className={classNames({'current-date-column':currentDate})}></td>;
                  }
                })}
              </tr>
            );
          })}
          <tr className="table-total-count">
            <td>Total</td>
            {week.map((weekDay,index) => {
              return (
                <td key={'total'+index}>
                  <a onClick={() => onClick(weekDay.date)}>
                    {weekDay.totalCount > 0 ? weekDay.totalCount : ""}
                  </a>
                  <span className="missed-count">
                    {weekDay.missedCount > 0
                      ? " (" + weekDay.missedCount + " missed)"
                      : ""}
                  </span>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default injectIntl(GridSummary);
