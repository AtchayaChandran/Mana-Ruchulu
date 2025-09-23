import AboutImage from "../assets/image/img.png"; 

export default function About() {
  return (
    <div className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8">
        
        {/* Image */}
        <div className="flex-shrink-0 lg:w-1/2">
          <img 
            src={AboutImage} 
            alt="Mana Ruchulu" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Text */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-semibold mb-4">About Mana Ruchulu</h1>
          <p className="text-purple-800 text-[18px] leading-relaxed">
            At Mana Ruchulu, food is more than just a meal—it’s a journey home. 
            Inspired by the rich culinary traditions of Andhra and Hyderabad, we bring 
            the authentic flavors of our heritage straight to your plate. Every dish tells a story—of age-old recipes passed down through generations, of spices blended 
            with love and care, and of the joy that comes from sharing a meal with family and friends. 
            From the fiery tang of Andhra curries to the royal aroma of Hyderabadi biryani, we celebrate the
            vibrant tastes that make our cuisine truly unforgettable. With branches all over India, we’re proud to bring the soul of Andhra and Hyderabadi 
            cuisine to every corner of the country. At Mana Ruchulu, every bite is crafted to transport you 
            to the heart of our kitchens, where passion, tradition, and flavor come together in harmony.
            Come, savor the taste of tradition. Experience the soul of Andhra and Hyderabad, at Mana Ruchulu.
          </p>
        </div>

      </div>
    </div>
  )
}




















