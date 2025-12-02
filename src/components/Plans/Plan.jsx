import React, { useEffect, useState } from "react";
import { Api } from "../../Context/apiService";
import { Plus, Edit3, Loader, IndianRupee, Calendar, Tag } from "lucide-react";
import PlanModal from "./PlanModal";
import MessagePopup from "../Common/MessagePopup";

export default function Plan({ role }) {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });

    const showMessage = (text, type) => {
        setMessage({ text, type });
    };

    const closeMessage = () => {
        setMessage({ text: '', type: '' });
    };

    // Fetch plans
    const fetchPlans = async () => {
        setLoading(true);
        try {
            const resp = await Api.getPlans();
            console.log("Plans fetched:", resp);
            setPlans(resp?.data?.plans || []);
        } catch (error) {
            console.error("Error fetching plans:", error);
            showMessage("Failed to load plans.", "error");
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // Handle create or update
    const handlePlanSubmit = async (data) => {
        try {
            if (editingPlan) {
                await Api.updatePlan(editingPlan._id, data);
                showMessage('Plan updated successfully!', 'success');
            } else {
                await Api.createPlan(data);
                showMessage('Plan created successfully!', 'success');
            }
            setModalOpen(false);
            setEditingPlan(null);
            fetchPlans();
        } catch (error) {
            console.error("Error submitting plan:", error);
            showMessage('Failed to save plan', 'error');
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setModalOpen(true);
    };

    const formatFeatures = (features) => {
        if (Array.isArray(features)) return features;
        if (typeof features === 'string') return features.split(',').map(f => f.trim());
        return [];
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Message Popup */}
            {message.text && (
                <MessagePopup
                    message={message.text}
                    type={message.type}
                    onClose={closeMessage}
                />
            )}
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Plans</h1>
                    {/* <p className="text-gray-600 mt-2">Choose the plan that works best for you</p> */}
                </div>
                {role === "admin" && (
                    <button
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                        onClick={() => {
                            setEditingPlan(null);
                            setModalOpen(true);
                        }}
                    >
                        <Plus className="w-5 h-5" />
                        Add New Plan
                    </button>
                )}
            </div>

            {/* Plan Modal */}
            <PlanModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingPlan(null);
                }}
                onSubmit={handlePlanSubmit}
                initialValues={editingPlan}
            />

            {/* Plans Grid/Table */}
            {loading ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading plans...</p>
                </div>
            ) : plans.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No plans available</h3>
                        <p className="text-gray-600 mb-6">There are no plans at the moment.</p>
                        {role === "admin" && (
                            <button
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => setModalOpen(true)}
                            >
                                Create First Plan
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan._id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                        >
                            {/* Plan Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    {role === "admin" && (
                                        <button
                                            onClick={() => handleEdit(plan)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200"
                                            title="Edit plan"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-1 mt-3">
                                    <IndianRupee className="w-5 h-5 text-gray-700" />
                                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                                    {plan.discount > 0 && (
                                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                            {plan.discount}% off
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Plan Details */}
                            <div className="p-6">
                                {/* Duration */}
                                <div className="flex items-center gap-2 text-gray-600 mb-4">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">{plan.durationInDays} days</span>
                                </div>

                                {/* Features */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Features</h4>
                                    <ul className="space-y-2">
                                        {formatFeatures(plan.features).map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Button for Users */}
                                {role !== "admin" && (
                                    <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                        Choose Plan
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Alternative Table View for Admin (commented out) */}
            {/*
      {role === "admin" && plans.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold">All Plans Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{plan.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{plan.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{plan.durationInDays} days</td>
                    <td className="px-6 py-4 whitespace-nowrap">{plan.discount || 0}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      */}
        </div>
    );
}