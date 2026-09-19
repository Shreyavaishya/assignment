const generateReviews = ({
  rating,
  businessType,
  service,
  context,
}) => {
  const serviceText = service || "service";
  const businessText = businessType || "business";
  const contextText = context?.trim();

  if (rating >= 4) {
    const suggestions = [
      `Great experience at the ${businessText}. The ${serviceText} was excellent and the staff was friendly. Would definitely recommend.`,

      `I had a wonderful experience with the ${serviceText}. The service was professional and the staff was welcoming. I'd happily visit again.`,

      `Really happy with my experience. The ${serviceText} was handled well and the overall service was great. I would definitely recommend this place.`,
    ];

    if (contextText) {
      suggestions[0] = `Great experience at the ${businessText}. ${contextText}. The ${serviceText} was excellent. Would definitely recommend.`;
    }

    return suggestions;
  }

  const suggestions = [
    `The overall experience was okay, but there are some areas that could be improved. Better attention to the customer's concerns would improve the experience.`,

    `The ${serviceText} was satisfactory, but there is room for improvement. I hope the team can improve the overall customer experience.`,

    `I appreciate the effort, but the experience could have been better. Addressing customer concerns more carefully would improve the service.`,
  ];

  if (contextText) {
    suggestions[0] = `The ${serviceText} was satisfactory, but ${contextText.toLowerCase()}. Better attention to this issue would improve the overall experience.`;
  }

  return suggestions;
};

export default generateReviews;

