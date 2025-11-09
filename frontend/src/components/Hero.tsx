// import React from 'react'
//
// const Hero = () => {
//   return (
//     <div className='relative flex flex-col items-center justify-start mb-[20vh]'>
//         <div className='text-4xl mt-18 my-4'>
//           Ready to Sharpen Your Interview Skills?
//         </div>
//         <div>*Sign in with Google Button Here*</div>
//     </div>
//   )
// }
//
// export default Hero
//
//
// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// // import { IconBrandGoogle } from "@tabler/icons-react"
//
// const Hero = () => {
//   return (
//     <section className="relative flex flex-col items-center justify-center text-center min-h-[90vh] bg-gradient-to-b from-white to-gray-50 overflow-hidden">
//       {/* Decorative background gradient */}
//       <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-transparent" />
//
//       {/* Floating blur blobs */}
//       <div className="absolute top-20 left-10 w-60 h-60 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse" />
//       <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-40 animate-pulse" />
//
//       <motion.h1
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight"
//       >
//         Ready to Sharpen Your Interview Skills?
//       </motion.h1>
//
//       <motion.p
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3, duration: 0.6 }}
//         className="text-lg text-gray-600 mt-4 max-w-xl"
//       >
//         Practice, analyze, and improve your interview performance — powered by AI feedback and data-driven insights.
//       </motion.p>
//
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5, duration: 0.6 }}
//         className="mt-8"
//       >
//         <Button className="flex items-center gap-2 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:shadow-xl">
//           {/* <IconBrandGoogle size={20} /> */}
//           Sign in with Google
//         </Button>
//       </motion.div>
//     </section>
//   )
// }
//
// export default Hero
//
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { IconBrandGoogle } from "@tabler/icons-react"

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[90vh] bg-gradient-to-b from-white to-gray-50 overflow-hidden px-6">
      {/* Soft gradient and glowing blobs */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-transparent" />
      <div className="absolute top-10 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-300 rounded-full blur-3xl opacity-30 animate-pulse" />

      {/* Brand title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-6xl sm:text-7xl font-extrabold mb-6"
      >
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Inter
        </span>
        <motion.span
          animate={{
            backgroundPosition: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-[length:200%_200%] bg-clip-text text-transparent"
        >
          (Re)view
        </motion.span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-lg text-gray-600 max-w-xl"
      >
        Practice real interviews. Get instant AI feedback.
        Elevate your performance and land your dream job.
      </motion.p>

      {/* Sign in button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mt-10"
      >
        <Button className="flex items-center gap-2 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:shadow-xl">
          <IconBrandGoogle size={20} />
          Sign in with Google
        </Button>
      </motion.div>

      {/* Subtle divider */}
      <div className="mt-20 text-sm text-gray-400">
        © {new Date().getFullYear()} InterReview. All rights reserved.
      </div>
    </section>
  )
}

export default Hero
