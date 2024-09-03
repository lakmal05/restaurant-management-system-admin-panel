import React from "react";
import ReactApexChart from "react-apexcharts";
import { Container } from "reactstrap";

class ApexLineChartComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Kasbawa",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
          name: "Nawala",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
        {
          name: "Kadawatha",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
          ],
        },
        yaxis: {
          title: {
            text: "LKR (Sri Lankan Rupees)",
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "LKR " + val + " thousands";
              // return "$ " + val + " thousands";
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default ApexLineChartComponent;
