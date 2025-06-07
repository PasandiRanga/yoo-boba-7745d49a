import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTopButton from "@/components/ui/back-to-top";
import FloatingBubbles from "@/components/animations/floatingBubbles";
import BYOBHero from "@/components/BYOB/BYOBHero";
import BYOBForm from "@/components/BYOB/BYOBForm";
import BYOBBenefits from "@/components/BYOB/BYOBBenifits";
import BYOBPerfectFor from "@/components/BYOB/BYOBPerfector";
import { useToast } from "@/components/BYOB/BYOBAToast";

const BYOBPage = () => {
  const { showToast, ToastContainer } = useToast();

  const handleFormSuccess = () => {
    console.log("handleFormSuccess called");
    showToast(
      "🎉 We got your inquiry! Our team will reach out to you soon with wholesale pricing and details.",
      "success",
      6000
    );
    
    // Refresh the page after a short delay to allow toast to be seen
    setTimeout(() => {
      window.location.reload();
    }, 6000); // 2 second delay
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        <BYOBHero />
        <section className="py-16 dark:bg-gray-900/60">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <BYOBForm onSuccess={handleFormSuccess} />
              <div>
                <BYOBBenefits />
                <BYOBPerfectFor />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTopButton />
      <ToastContainer />
    </div>
  );
};

export default BYOBPage;