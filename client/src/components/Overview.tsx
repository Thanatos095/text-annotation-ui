import { ClientInferResponseBody } from "@ts-rest/core";
import { AnnotationContract } from "api";
import { Bar, BarChart, LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";


type AnnotationContractType = ClientInferResponseBody<typeof AnnotationContract['getAnnotatedCountOverTime'], 200> 

// const data = [
//   {
//     name: "Jan",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Feb",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Mar",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Apr",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "May",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jun",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jul",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Aug",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Sep",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Oct",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Nov",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Dec",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ]

interface Props {
  data: AnnotationContractType | undefined
}

export function Overview({data} : Props) {
  {console.log("brudda", data)}
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="day"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Line dataKey="count" fill="#adfa1d" />
      </LineChart>
    </ResponsiveContainer>
  )
}