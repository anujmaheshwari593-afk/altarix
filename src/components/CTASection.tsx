import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Calculate?
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Get precise atmospheric properties for any altitude in seconds. 
            Export your results and integrate with your engineering workflow.
          </p>
          
          <Link to="/calculator">
            <Button size="lg" className="btn-hero group">
              <Calculator className="mr-2 h-5 w-5" />
              Open Calculator
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <p className="mt-8 text-sm text-white/50">
            No signup required • Free to use • Research-grade accuracy
          </p>
        </div>
      </div>
    </section>
  );
}
