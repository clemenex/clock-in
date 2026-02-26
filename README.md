# cLock In: Productivity Intelligence Suite

cLock In is a next-generation time-tracking and career-building application designed specifically for developers, interns, and knowledge workers. It transcends standard timesheets by analyzing cognitive load, gamifying skill progression, and automatically synthesizing your daily logs into professional, STAR-method resume bullets.

✨ Core Innovative Features

🧠 Cognitive Friction Analytics: Track your "Mental Drain" (1-5) on every log. The app automatically correlates your friction levels with your daily Meeting Ratios, helping you identify flow-state blockers and advocate for "No-Meeting" focus days.

🎮 Developer Skill Tree: Add tags like #python or #react to your raw time entries. The dashboard aggregates these tags into an RPG-style Skill Tree, visually tracking your progression and "leveling up" your skills as you put in the hours.

📄 Portfolio Harvester: Stop struggling to remember what you did months ago. The app analyzes your highest-duration tasks and key learnings to automatically generate STAR-method (Situation, Task, Action, Result) bullet points, perfectly formatted for your LinkedIn or Resume.

🤖 Natural Language Parser: Don't fiddle with clunky start/stop timers. Just type what you did in plain text (e.g., Built API integration #django 9:00 - 11:30) and the app instantly calculates durations, extracts tags, and maps it to your projects.

📊 One-Click DOCX Reporting: Instantly export beautiful, high-fidelity monthly timesheet and progress reports directly to Microsoft Word .docx format.

☁️ Supabase Cloud Sync: Secure authentication and real-time database syncing across all your devices via Supabase PostgreSQL.

🛠️ Tech Stack

Frontend: React, Next.js (App Router), Tailwind CSS

Backend / Auth: Supabase (PostgreSQL)

Icons: Lucide React

Export Engine: docx (npm package)

🚀 Getting Started

1. Prerequisites

Node.js (v18+)

A Supabase account (free tier works perfectly)

2. Database Setup (Supabase)

Navigate to your Supabase project's SQL Editor and run the following script to create your tables and security policies:

-- Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    link TEXT,
    color TEXT DEFAULT '#004AAD',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, name)
);

-- Create Logs Table
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date TEXT NOT NULL,
    tasks JSONB DEFAULT '[]'::jsonb,
    total_hours NUMERIC DEFAULT 0,
    key_learnings TEXT,
    friction_level NUMERIC DEFAULT 3,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Add User Policies
CREATE POLICY "Manage own projects" ON public.projects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Manage own logs" ON public.logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects, public.logs;


3. Local Installation

Clone the repository and install the dependencies:

git clone [https://github.com/your-username/clock-in.git](https://github.com/your-username/clock-in.git)
cd clock-in
npm install


4. Environment Variables

Create a .env.local file in the root of your project and add your Supabase keys (found in your Supabase Project Settings > API):

NEXT_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here


5. Run the Application

Start the local development server:

npm run dev


Open http://localhost:3000 in your browser. You can now sign up for an account and start tracking your productivity!

💡 Usage Workflows

Register Projects: Head to the Directory tab first. Add the specific projects or overarching goals you are working on. Assign them a color for visual tracking.

Log Your Day: At the end of the day, go to the Log Sheet. Type your tasks in the text box using the format: Task Name #tag1 #tag2 [Start] - [End].

Example: Database Migration #sql #backend 1:30 - 4:00

Assess Friction: Use the slider to rate the mental drain of your day. Log your key learnings in the reflections box. Click Commit Changes.

Reap the Rewards: Visit the Dashboard to see your stats, Skill Tree, and friction analytics. Visit the Portfolio tab to copy your newly minted resume bullets.

📄 License

This project is licensed under the MIT License.