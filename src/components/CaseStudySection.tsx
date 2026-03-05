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

export default function CaseStudySection() {
  return (
    <section id="casestudy" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-sm font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Case Study
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            WhatsApp <span className="neon-text-violet">Growth</span> Campaign
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            At Expodite, I led a bulk WhatsApp outreach campaign using Aisensy,
            targeting export industry professionals. Here's how data-driven
            iteration transformed results over 6 months.
          </p>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold neon-text">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              <span className="text-xs font-mono text-green-400 mt-2 inline-block">
                {m.delta}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Leads & Conversions Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
                <XAxis dataKey="month" stroke="hsl(220 10% 55%)" fontSize={12} />
                <YAxis stroke="hsl(220 10% 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(220 20% 10%)",
                    border: "1px solid hsl(220 15% 18%)",
                    borderRadius: "8px",
                    color: "hsl(220 20% 92%)",
                  }}
                />
                <Bar dataKey="leads" fill="hsl(217 100% 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill="hsl(270 80% 65%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Engagement Rate (%)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
                <XAxis dataKey="week" stroke="hsl(220 10% 55%)" fontSize={12} />
                <YAxis stroke="hsl(220 10% 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(220 20% 10%)",
                    border: "1px solid hsl(220 15% 18%)",
                    borderRadius: "8px",
                    color: "hsl(220 20% 92%)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(217 100% 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(217 100% 60%)", r: 4 }}
                  activeDot={{ r: 6, fill: "hsl(270 80% 65%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
