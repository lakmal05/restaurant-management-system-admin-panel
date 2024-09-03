import React, { useEffect } from "react";
import { Container } from "reactstrap";
import ApexChart from "react-apexcharts";
import Cookies from "js-cookie";

export class ApexChartComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
      options: {
        chart: {
          type: "polarArea",
        },
        stroke: {
          colors: ["#fff"],
        },
        fill: {
          opacity: 0.8,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ApexChart
            options={this.state.options}
            series={this.state.series}
            type="polarArea"
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
