import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reservations = sqliteTable("reservations", {
  id: text("id").primaryKey(),
  nickname: text("nickname").notNull(),
  email: text("email").notNull(),
  customerType: text("customer_type").notNull(),
  service: text("service").notNull(),
  fortuneType: text("fortune_type"),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  alternateDate: text("alternate_date"),
  alternateTime: text("alternate_time"),
  paymentMethod: text("payment_method").notNull(),
  topic: text("topic"),
  amount: integer("amount").notNull(),
  duration: integer("duration").notNull(),
  status: text("status").notNull().default("provisional"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  meetingUrl: text("meeting_url"),
  adminNote: text("admin_note"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
