import React from 'react';
import { AlertTriangle, Heart, Shield, Info } from 'lucide-react';
import { DiseaseRisk } from '@/types';
import { Card } from '@/components/dashboard/ui/card';
import { Badge } from '@/components/dashboard/ui/badge';
import { Progress } from '@/components/dashboard/ui/progress';
import { cn } from '@/lib/utils';

interface DiseaseRiskPanelProps {
  diseaseRisks: DiseaseRisk[];
  villageName: string;
}

const DiseaseRiskPanel: React.FC<DiseaseRiskPanelProps> = ({ 
  diseaseRisks, 
  villageName 
}) => {
  const getRiskColor = (riskLevel: DiseaseRisk['riskLevel']) => {
    switch (riskLevel) {
      case 'Critical':
        return 'text-destructive';
      case 'High':
        return 'text-destructive';
      case 'Medium':
        return 'text-warning';
      case 'Low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBadgeVariant = (riskLevel: DiseaseRisk['riskLevel']) => {
    switch (riskLevel) {
      case 'Critical':
        return 'destructive';
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRiskIcon = (riskLevel: DiseaseRisk['riskLevel']) => {
    switch (riskLevel) {
      case 'Critical':
      case 'High':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Medium':
        return <Info className="h-4 w-4" />;
      case 'Low':
        return <Shield className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const overallRisk = diseaseRisks.reduce((max, risk) => {
    const riskScores = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
    return Math.max(max, riskScores[risk.riskLevel] || 0);
  }, 0);

  const overallRiskLevel = ['Low', 'Medium', 'High', 'Critical'][overallRisk - 1] || 'Low';

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Disease Risk Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            AI-calculated health risks for {villageName}
          </p>
        </div>
      </div>

      {/* Overall Risk Summary */}
      <div className={cn(
        "p-4 rounded-lg border-2 mb-6 transition-all duration-300",
        overallRiskLevel === 'Critical' ? "border-destructive/30 bg-destructive/5" :
        overallRiskLevel === 'High' ? "border-destructive/30 bg-destructive/5" :
        overallRiskLevel === 'Medium' ? "border-warning/30 bg-warning/5" :
        "border-success/30 bg-success/5"
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getRiskIcon(overallRiskLevel as DiseaseRisk['riskLevel'])}
            <h3 className="font-semibold text-foreground">Overall Health Risk</h3>
          </div>
          <Badge 
            variant={getRiskBadgeVariant(overallRiskLevel as DiseaseRisk['riskLevel'])}
            className={cn(
              overallRiskLevel === 'Critical' && "animate-pulse-glow"
            )}
          >
            {overallRiskLevel} Risk
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on current water quality parameters and contamination levels
        </p>
      </div>

      {/* Individual Disease Risks */}
      <div className="space-y-4">
        {diseaseRisks.map((risk, index) => (
          <div
            key={risk.disease}
            className={cn(
              "p-4 rounded-lg border transition-all duration-300 animate-slide-up hover:shadow-md",
              risk.riskLevel === 'Critical' ? "border-destructive/30 bg-destructive/5" :
              risk.riskLevel === 'High' ? "border-destructive/30 bg-destructive/5" :
              risk.riskLevel === 'Medium' ? "border-warning/30 bg-warning/5" :
              "border-success/30 bg-success/5"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Disease Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={cn("font-medium text-foreground", getRiskColor(risk.riskLevel))}>
                  {getRiskIcon(risk.riskLevel)}
                </span>
                <h4 className="font-medium text-foreground">{risk.disease}</h4>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getRiskBadgeVariant(risk.riskLevel)}>
                  {risk.riskLevel}
                </Badge>
                <span className={cn("text-sm font-medium", getRiskColor(risk.riskLevel))}>
                  {risk.probability}%
                </span>
              </div>
            </div>

            {/* Risk Probability Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Risk Probability</span>
                <span className="text-foreground">{risk.probability}%</span>
              </div>
              <Progress 
                value={risk.probability} 
                className={cn(
                  "h-2",
                  risk.riskLevel === 'Critical' && "bg-destructive/20",
                  risk.riskLevel === 'High' && "bg-destructive/20",
                  risk.riskLevel === 'Medium' && "bg-warning/20",
                  risk.riskLevel === 'Low' && "bg-success/20"
                )}
              />
            </div>

            {/* Symptoms */}
            <div className="mb-3">
              <h5 className="text-sm font-medium text-foreground mb-2">
                Common Symptoms:
              </h5>
              <div className="flex flex-wrap gap-1">
                {risk.symptoms.map((symptom, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Prevention */}
            <div>
              <h5 className="text-sm font-medium text-foreground mb-2">
                Prevention Measures:
              </h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {risk.prevention.map((measure, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Health Advisory */}
      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Health Advisory</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • Monitor water quality parameters continuously
              </p>
              <p>
                • Implement immediate treatment if contamination is detected
              </p>
              <p>
                • Educate villagers about waterborne disease prevention
              </p>
              <p>
                • Maintain emergency medical supplies for high-risk areas
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DiseaseRiskPanel;