import { task, schedules } from "@trigger.dev/sdk/v3";
import { MembershipChecker } from "@/lib/membership-checker";

// Daily membership expiry check task
export const dailyMembershipCheck = task({
  id: "daily-membership-check",
  run: async (payload) => {
    console.log("Starting daily membership expiry check with AI validation");

    try {
      const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/membership-webhook`;
      const checker = new MembershipChecker(webhookUrl);
      
      await checker.processExpiredMembers();
      console.log("Daily membership check completed successfully");
      
      return { success: true, message: "Membership check completed" };

    } catch (error) {
      console.error("Daily membership check failed:", error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }
});

// Schedule the task to run daily at 9 AM UTC
export const dailySchedule = schedules.create({
  task: "daily-membership-check",
  cron: "0 9 * * *", // Every day at 9:00 AM UTC
  timezone: "UTC"
});
