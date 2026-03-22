import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialFormData = {
    projectName: '',
    description: '',
    buildType: '',
    buildTypeDetails: '',
    category: '',
    communicationMethod: '',
    communicationHandle: '',
    userName: '',
    userRole: '',
    referralSource: '',
    referralDetails: ''
};

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setStep(1);
            setFormData(initialFormData);
            setIsSuccess(false);
        }, 300);
    };

    // Validation
    const isStepValid = () => {
        switch (step) {
            case 1: return formData.projectName.length > 0;
            case 2: return formData.description.length > 0;
            case 3: return formData.buildType.length > 0;
            case 4: return formData.category.length > 0;
            case 5: return formData.communicationMethod.length > 0 && formData.communicationHandle.length > 0;
            case 6: return formData.userName.length > 0 && formData.userRole.length > 0;
            case 7: return formData.referralSource.length > 0;
            default: return false;
        }
    };

    const handleNext = () => {
        if (isStepValid()) {
            if (step < 7) setStep(step + 1);
            else handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        // Anti-grief: 10-minute cooldown between submissions
        const lastSubmit = localStorage.getItem('via-onboarding-last-submit');
        if (lastSubmit) {
            const elapsed = Date.now() - parseInt(lastSubmit, 10);
            const cooldownMs = 10 * 60 * 1000; // 10 minutes
            if (elapsed < cooldownMs) {
                const minutesLeft = Math.ceil((cooldownMs - elapsed) / 60000);
                alert(`Please wait ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''} before submitting again.`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const body = new URLSearchParams({
                'form-name': 'onboarding',
                'bot-field': '', // honeypot — must be empty for legit submissions
                ...formData
            });

            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            });

            if (!response.ok) throw new Error('Submission failed');

            localStorage.setItem('via-onboarding-last-submit', Date.now().toString());
            setIsSuccess(true);
        } catch (err) {
            console.error('Form submission error:', err);
            alert('Something went wrong. Please try again or contact us directly at hello@vialabs.tech');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isSuccess && handleClose()}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative mx-2 sm:mx-4"
                        >
                            {/* Header */}
                            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex justify-between items-center bg-white">

                                {isSuccess ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle2 size={24} />
                                        <span className="font-bold text-lg">Submission Received</span>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Onboarding Assistance</h2>
                                        <div className="flex gap-1 mt-2">
                                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 w-5 sm:w-8 rounded-full transition-colors ${i <= step ? 'bg-via-teal' : 'bg-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!isSuccess && (
                                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-4 sm:p-8 min-h-[300px] sm:min-h-[400px] flex flex-col">
                                {isSuccess ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank you!</h3>
                                            <p className="text-slate-600 max-w-md mx-auto">
                                                Your information has been forwarded to the VIA Labs team. We'll be in touch shortly via your preferred communication method.
                                            </p>
                                        </div>

                                        <div className="pt-4 w-full max-w-sm">
                                            <p className="text-sm text-slate-500 mb-3 uppercase tracking-wider font-semibold">Want to talk sooner?</p>
                                            <a
                                                href="https://calendly.com/via_labs"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl hover:shadow-2xl"
                                            >
                                                Book a Call on Calendly
                                            </a>
                                        </div>

                                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm mt-8">
                                            Close Window
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        {/* Step 1: Project Name */}
                                        {step === 1 && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                                <h3 className="text-2xl font-semibold text-slate-800">What is the name of your project or company?</h3>
                                                <input
                                                    type="text"
                                                    value={formData.projectName}
                                                    onChange={(e) => updateField('projectName', e.target.value)}
                                                    placeholder="Project Name"
                                                    className="w-full text-lg p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-via-teal focus:ring-2 focus:ring-via-teal/20 outline-none transition-all"
                                                    autoFocus
                                                />
                                            </div>
                                        )}

                                        {/* Step 2: Description */}
                                        {step === 2 && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                                <h3 className="text-2xl font-semibold text-slate-800">Tell us what you're building.</h3>
                                                <p className="text-slate-500">Share your vision and include any relevant links if available.</p>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => updateField('description', e.target.value)}
                                                    placeholder="We are building..."
                                                    className="w-full h-40 text-lg p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-via-teal focus:ring-2 focus:ring-via-teal/20 outline-none transition-all resize-none"
                                                    autoFocus
                                                />
                                            </div>
                                        )}

                                        {/* Step 3: Build Plans */}
                                        {step === 3 && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                                <h3 className="text-2xl font-semibold text-slate-800">How do you plan to build this?</h3>
                                                <div className="space-y-3">
                                                    {['We plan to build this ourselves', 'We want it built for us', 'Other'].map((option) => (
                                                        <label key={option} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.buildType === option ? 'border-via-teal bg-via-teal/5 ring-1 ring-via-teal' : 'border-slate-200 hover:border-via-teal/50'}`}>
                                                            <input
                                                                type="radio"
                                                                name="buildType"
                                                                value={option}
                                                                checked={formData.buildType === option}
                                                                onChange={(e) => updateField('buildType', e.target.value)}
                                                                className="w-5 h-5 accent-via-teal"
                                                            />
                                                            <span className="text-lg text-slate-700">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {formData.buildType === 'Other' && (
                                                    <input
                                                        type="text"
                                                        value={formData.buildTypeDetails}
                                                        onChange={(e) => updateField('buildTypeDetails', e.target.value)}
                                                        placeholder="Please explain..."
                                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-via-teal outline-none"
                                                        autoFocus
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* Step 4: Category */}
                                        {step === 4 && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                                <h3 className="text-2xl font-semibold text-slate-800">What category best fits your project?</h3>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {[
                                                        'Cross-Chain Tokens or Stablecoins',
                                                        'Cross-Chain Non-Fungible Assets',
                                                        'Data Streaming',
                                                        'Chain Integration',
                                                        'Other'
                                                    ].map((option) => (
                                                        <label key={option} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.category === option ? 'border-via-teal bg-via-teal/5 ring-1 ring-via-teal' : 'border-slate-200 hover:border-via-teal/50'}`}>
                                                            <input
                                                                type="radio"
                                                                name="category"
                                                                value={option}
                                                                checked={formData.category === option}
                                                                onChange={(e) => updateField('category', e.target.value)}
                                                                className="w-5 h-5 accent-via-teal"
                                                            />
                                                            <span className="text-lg text-slate-700">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 5: Communication */}
                                        {step === 5 && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                                <h3 className="text-2xl font-semibold text-slate-800">How should we contact you?</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {['Telegram', 'Discord', 'Slack', 'Email'].map((method) => (
                                                        <button
                                                            key={method}
                                                            onClick={() => updateField('communicationMethod', method)}
                                                            className={`px-6 py-3 rounded-xl border font-medium transition-all ${formData.communicationMethod === method ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                                                        >
                                                            {method}
                                                        </button>
                                                    ))}
                                                </div>

                                                {formData.communicationMethod && (
                                                    <div className="animate-in fade-in duration-300">
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                                            {formData.communicationMethod === 'Telegram' ? 'Your Telegram Handle' :
                                                                formData.communicationMethod === 'Discord' ? 'Your Discord Username' :
                                                                    formData.communicationMethod === 'Slack' ? 'Your Email Address' :
                                                                        'Your Email Address'}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.communicationHandle}
                                                            onChange={(e) => updateField('communicationHandle', e.target.value)}
                                                            placeholder={
                                                                formData.communicationMethod === 'Telegram' ? '@username' :
                                                                    formData.communicationMethod === 'Discord' ? 'username' :
                                                                        'name@example.com'
                                                            }
                                                            className="w-full text-lg p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-via-teal focus:ring-2 focus:ring-via-teal/20 outline-none transition-all"
                                                            autoFocus
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Step 6: User Info */}
                                        {step === 6 && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                                <h3 className="text-2xl font-semibold text-slate-800">Tell us a bit about yourself.</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                                                        <input
                                                            type="text"
                                                            value={formData.userName}
                                                            onChange={(e) => updateField('userName', e.target.value)}
                                                            className="w-full text-lg p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-via-teal focus:ring-2 focus:ring-via-teal/20 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Your Role</label>
                                                        <input
                                                            type="text"
                                                            value={formData.userRole}
                                                            onChange={(e) => updateField('userRole', e.target.value)}
                                                            placeholder="Founder, Developer, Product Manager..."
                                                            className="w-full text-lg p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-via-teal focus:ring-2 focus:ring-via-teal/20 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 7: Referral Source */}
                                        {step === 7 && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                                <h3 className="text-2xl font-semibold text-slate-800">How did you hear about VIA Labs?</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {[
                                                        'X / Twitter',
                                                        'Conference',
                                                        'Internet Search',
                                                        'AI Agent',
                                                        'Direct Referral',
                                                        'Other'
                                                    ].map((option) => (
                                                        <label key={option} className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${formData.referralSource === option ? 'border-via-teal bg-via-teal/5 ring-1 ring-via-teal' : 'border-slate-200 hover:border-via-teal/50'}`}>
                                                            <input
                                                                type="radio"
                                                                name="referralSource"
                                                                value={option}
                                                                checked={formData.referralSource === option}
                                                                onChange={(e) => updateField('referralSource', e.target.value)}
                                                                className="w-5 h-5 accent-via-teal flex-shrink-0"
                                                            />
                                                            <span className="text-base sm:text-lg text-slate-700">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {formData.referralSource === 'Direct Referral' && (
                                                    <input
                                                        type="text"
                                                        value={formData.referralDetails}
                                                        onChange={(e) => updateField('referralDetails', e.target.value)}
                                                        placeholder="Who referred you?"
                                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-via-teal outline-none mt-2"
                                                        autoFocus
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {!isSuccess && (
                                <div className="px-4 sm:px-8 py-4 sm:py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                    <button
                                        onClick={handleBack}
                                        disabled={step === 1}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${step === 1
                                            ? 'opacity-0 pointer-events-none'
                                            : 'text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        <ArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        disabled={!isStepValid() || isSubmitting}
                                        className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-full font-semibold text-white text-sm sm:text-base transition-all shadow-lg ${!isStepValid() || isSubmitting
                                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                            : 'bg-via-teal hover:bg-via-teal/90 hover:scale-105 shadow-via-teal/30'
                                            }`}
                                    >
                                        {isSubmitting ? 'Sending...' : step === 7 ? 'Submit' : 'Next'}
                                        {!isSubmitting && <ArrowRight size={18} />}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
