import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const onboardingQuestions = [
    "Welcome! Let's get started. What's your business website?",
    "What's your monthly ad budget?",
    "Who is your target audience?",
    "What is your main goal for running ads? (e.g., leads, sales, brand awareness)",
    "Thanks! You're all set."
  ];

  const quickPrompts = [
    "Show this week's analytics",
    "Request a new campaign",
    "Analyze a landing page",
    "Optimize my targeting"
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const alreadyOnboarded = localStorage.getItem('onboardingComplete') === 'true';
    setOnboardingComplete(alreadyOnboarded);

    if (alreadyOnboarded) {
      setMessages([{ role: 'bot', text: "Welcome back! What would you like help with today?" }]);
    } else {
      setMessages([{ role: 'bot', text: onboardingQuestions[0] }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fakeBotTyping = (callback) => {
    setLoading(true);
    setTimeout(() => {
      callback();
      setLoading(false);
    }, 1000); // 1 second typing delay
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    if (!onboardingComplete) {
      // Onboarding flow
      fakeBotTyping(() => {
        const nextQuestionIndex = currentQuestion + 1;
        if (nextQuestionIndex < onboardingQuestions.length) {
          setMessages((prev) => [
            ...prev,
            {
