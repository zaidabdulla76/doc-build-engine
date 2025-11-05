-- Create workflows table for automation
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vendor_onboarding', 'risk_assessment', 'compliance_review', 'approval_routing')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  trigger_type TEXT NOT NULL DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'automatic', 'scheduled')),
  assigned_role TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create monitoring_alerts table for real-time alerts
CREATE TABLE IF NOT EXISTS public.monitoring_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('risk_score_change', 'compliance_issue', 'financial_distress', 'news_sentiment', 'regulatory_change')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'investigating', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on workflows
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- RLS policies for workflows
CREATE POLICY "Users can view their workflows"
  ON public.workflows FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their workflows"
  ON public.workflows FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their workflows"
  ON public.workflows FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their workflows"
  ON public.workflows FOR DELETE
  USING (user_id = auth.uid());

-- Enable RLS on monitoring_alerts
ALTER TABLE public.monitoring_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for monitoring alerts (role-based access)
CREATE POLICY "Role-based alert access"
  ON public.monitoring_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors v
      WHERE v.id = monitoring_alerts.vendor_id
      AND (v.user_id = auth.uid() OR has_any_role(auth.uid(), ARRAY[
        'procurement_director'::app_role,
        'category_manager'::app_role,
        'compliance_officer'::app_role,
        'gcc_leader'::app_role,
        'it_security_officer'::app_role
      ]))
    )
  );

CREATE POLICY "Authorized roles can update alerts"
  ON public.monitoring_alerts FOR UPDATE
  USING (
    has_any_role(auth.uid(), ARRAY[
      'procurement_director'::app_role,
      'category_manager'::app_role,
      'compliance_officer'::app_role,
      'gcc_leader'::app_role
    ])
  );

-- Create trigger for workflows updated_at
CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON public.workflows(status);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_vendor_id ON public.monitoring_alerts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_status ON public.monitoring_alerts(status);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_severity ON public.monitoring_alerts(severity);