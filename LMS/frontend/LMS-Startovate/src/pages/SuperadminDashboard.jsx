import { Card, Radio, type StatisticProps, Statistic } from "antd";
import { useState } from "react";
import CountUp from "react-countup";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import transactions from "../data/transactions";
import { TransactionsTable } from "../components/TransactionsTable/TransactionsTable";
import PieChart from "../components/PieChart/PieChart";
console.log(transactions);

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const user = {
  name: "Usman Afzal",
  balance: "521,000.00",
  currency: "PKR ",
  budget: "100000",
  expenses: "30000",
};
const options = [
  {
    value: "Monthly",
    label: "Monthly",
  },
  {
    value: "Weekly",
    label: "Weekly",
  },
];
const calculateSavings = () => {
  const budget = parseFloat(user.budget);
  const expenses = parseFloat(user.expenses);
  let savings = budget - expenses;
  return String(savings);
};

const DashboardHome = () => {
  const [timePeriod, setTimePeriod] = useState("Monthly");
  const onPeriodChange = (e: any) => {
    setTimePeriod(e.target.value);
    console.log("Selected Period: ", e.target.value);
  };
  let savings = calculateSavings();

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3 }}
      className="md:p-6 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold">{`Welcome, ${user.name} ${"👋"}`}</h1>
      <div className="w-full rounded bg-[image:var(--background-gradient)] text-white flex flex-col gap-3 justify-center items-start p-4">
        <span className="text-lg">Balance</span>
        <span className="text-3xl font-bold ">
          {user.currency}
          {user.balance}
        </span>
      </div>
      <div className="flex items-center justify-center md:justify-between">
        <Radio.Group
          onChange={onPeriodChange}
          value={timePeriod}
          block
          options={options}
          defaultValue="Yearly"
          optionType="button"
          buttonStyle="solid"
          //   style={{ width: "100%" }}
          className="w-full md:w-1/5"
        />
        <span className=" hidden md:block text-text-grey">
          {timePeriod === "Monthly"
            ? "Showing data for current month"
            : "Showing data for current week"}
        </span>
      </div>
      <div className="flex flex-col items-center md:flex-row w-full gap-4 ">
        <Card variant="borderless" className="w-full md:w-4/5">
          <Statistic
            prefix={user.currency}
            title="Total Budget"
            value={parseInt(user.budget)}
            formatter={formatter}
            valueStyle={{
              fontWeight: "600",
              fontFamily: "Poppins",
            }}
          />
        </Card>
        <Card variant="borderless" className="w-full md:w-4/5">
          <Statistic
            prefix={user.currency}
            title="Total Expenses"
            valueStyle={{
              color: "#cf1322",
              fontWeight: "600",
              fontFamily: "Poppins",
            }}
            value={parseFloat(user.expenses)}
            formatter={formatter}
            suffix={<ArrowDownOutlined />}
          />
        </Card>
        <Card variant="borderless" className="w-full md:w-4/5">
          <Statistic
            prefix={user.currency}
            valueStyle={{
              color: "#3f8600",
              fontWeight: "600",
              fontFamily: "Poppins",
            }}
            title="Total Savings"
            value={parseFloat(savings)}
            formatter={formatter}
            suffix={<ArrowUpOutlined />}
          />
        </Card>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="w-full md:w-4/6 h-full flex flex-col gap-4">
          <h1 className="text-xl font-bold text-primary-blue">
            Recent Transactions
          </h1>
          <TransactionsTable rowLimit={5} pagination={false} />
        </div>
        <div className="w-full md:w-2/6 h-full flex flex-col gap-4">
          <h1 className="text-xl font-bold text-primary-blue">
            Income vs Expenses
          </h1>
          <div className="flex items-center justify-center w-full bg-white rounded p-6 shadow-md">
            <PieChart />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
