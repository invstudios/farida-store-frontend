"use client";
import React, { useContext } from "react";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import { useLocale } from "next-intl";
import { Chip, Spinner } from "@nextui-org/react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaCreditCard } from "react-icons/fa";

const PaymentStatusIndicator = () => {
  const { payment } = useContext(StoreContext);
  const locale = useLocale();

  // Don't show anything if no payment is in progress
  if (!payment.isInitiatingPayment && !payment.isProcessingPayment && !payment.paymentResult) {
    return null;
  }

  const getStatusIcon = () => {
    if (payment.isInitiatingPayment || payment.isProcessingPayment) {
      return <Spinner size="sm" color="primary" />;
    }
    
    if (payment.paymentResult) {
      if (payment.paymentResult.success) {
        return <FaCheckCircle className="text-green-500" />;
      } else if (payment.paymentResult.message?.includes("pending")) {
        return <FaClock className="text-yellow-500" />;
      } else {
        return <FaTimesCircle className="text-red-500" />;
      }
    }
    
    return <FaCreditCard className="text-blue-500" />;
  };

  const getStatusText = () => {
    if (payment.isInitiatingPayment) {
      return locale === "ar" ? "جاري تحضير الدفع..." : "Preparing payment...";
    }
    
    if (payment.isProcessingPayment) {
      return locale === "ar" ? "جاري معالجة الدفع..." : "Processing payment...";
    }
    
    if (payment.paymentResult) {
      if (payment.paymentResult.success) {
        return locale === "ar" ? "تم الدفع بنجاح" : "Payment successful";
      } else if (payment.paymentResult.message?.includes("pending")) {
        return locale === "ar" ? "الدفع قيد المراجعة" : "Payment pending";
      } else {
        return locale === "ar" ? "فشل الدفع" : "Payment failed";
      }
    }
    
    return locale === "ar" ? "جاهز للدفع" : "Ready to pay";
  };

  const getStatusColor = () => {
    if (payment.isInitiatingPayment || payment.isProcessingPayment) {
      return "primary";
    }
    
    if (payment.paymentResult) {
      if (payment.paymentResult.success) {
        return "success";
      } else if (payment.paymentResult.message?.includes("pending")) {
        return "warning";
      } else {
        return "danger";
      }
    }
    
    return "default";
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Chip
        startContent={getStatusIcon()}
        color={getStatusColor()}
        variant="flat"
        className="animate-pulse"
      >
        {getStatusText()}
      </Chip>
    </div>
  );
};

export default observer(PaymentStatusIndicator);
