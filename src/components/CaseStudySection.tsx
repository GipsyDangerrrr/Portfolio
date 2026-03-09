import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const campaignData = [
  { month: "Jan", leads: 120, conversions: 18 },
  { month: "Feb", leads: 280, conversions: 42 },
  { month: "Mar", leads: 450, conversions: 78 },
  { month: "Apr", leads: 620, conversions: 124 },
  { month: "May", leads: 890, conversions: 198 },
  { month: "Jun", leads: 1240, conversions: 310 },
];

const engagementData = [
  { week: "W1", rate: 2.1 },
  { week: "W2", rate: 3.4 },
  { week: "W3", rate: 5.8 },
  { week: "W4", rate: 8.2 },
  { week: "W5", rate: 12.6 },
  { week: "W6", rate: 18.4 },
  { week: "W7", rate: 24.1 },
  { week: "W8", rate: 34.2 },
];

const metrics = [
  { label: "Total Leads", value: "2,400+", delta: "+920%" },
  { label: "Conversion Rate", value: "25%", delta: "+15%" },
  { label: "Response Rate", value: "34%", delta: "+22%" },
  { label: "Cost Per Lead", value: "$0.42", delta: "-68%" },
];

const chartTooltipStyle = {
  background: "hsl(225 20% 8%)",
  border: "1px solid hsl(225 15% 14%)",
  borderRadius: "10px",
  color: "hsl(220 15% 93%)",
  fontSize: "12px",
  padding: "8px 12px",
};

export default function CaseStudySection() {
  return (
    <section id="casestudy" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Case Study
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            WhatsApp{" "}
            <span className="text-gradient">Growth</span>{" "}
            Campaign
          </h2>
          <p className="text-muted-foreground mt-5 max-w-2xl leading-relaxed">
            At Expodite, I led a bulk WhatsApp outreach campaign using Aisensy,
            targeting export industry professionals. Here's how data-driven
            iteration transformed results over 6 months.
          </p>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-subtle p-5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
              <p className="font-display text-2xl md:text-3xl font-bold text-gradient">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{m.label}</p>
              <span className="text-xs font-medium text-emerald-400 mt-2 inline-block">
                {m.delta}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-subtle p-6"
          >
            <h3 className="font-display text-base font-semibold mb-5">Leads & Conversions Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 14%)" />
                <XAxis dataKey="month" stroke="hsl(220 10% 40%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(220 10% 40%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="leads" fill="hsl(220 90% 56%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="conversions" fill="hsl(260 70% 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-subtle p-6"
          >
            <h3 className="font-display text-base font-semibold mb-5">Engagement Rate (%)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 14%)" />
                <XAxis dataKey="week" stroke="hsl(220 10% 40%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(220 10% 40%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(220 90% 56%)"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(220 90% 56%)", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "hsl(260 70% 60%)", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
