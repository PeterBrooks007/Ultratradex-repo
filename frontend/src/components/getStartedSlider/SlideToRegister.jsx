"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useTransform, useSpring, useAnimation, useAnimationControls } from "framer-motion"
import { Button, Typography, Box, styled } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Link } from "react-router-dom"
import { ArrowCircleRight } from "@phosphor-icons/react"

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6", // Tailwind's blue-500
    },
    background: {
      default: "#f3f4f6", // Tailwind's gray-100
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937", // Tailwind's gray-800
      secondary: "#6b7280", // Tailwind's gray-500
    },
  },
})

const SliderContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "64px",
  backgroundColor: theme.palette.grey[200],
  borderRadius: "32px",
  overflow: "hidden",
}))

const SliderHandle = styled(motion.div)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "64px",
  height: "100%",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}))

const SliderText = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  color: theme.palette.text.secondary,
}))

export default function SlideToRegister() {
  const [isDragging, setIsDragging] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const constraintsRef = useRef(null)
  const controls = useAnimation()
  const lightControls = useAnimationControls()
  const arrowControls = useAnimationControls()
  
  const x = useMotionValue(0)
  const xInput = [0, 300] // Adjust this value based on your slider width
  const background = useTransform(x, xInput, [
    "linear-gradient(90deg, #3b82f6 0%, #3b82f6 0%)",
    "linear-gradient(90deg, #3b82f6 0%, #3b82f6 100%)"
  ])

  const springX = useSpring(x, { stiffness: 300, damping: 30 })

  useEffect(() => {
    controls.start({ x: 0 })
    animateLight()
    animateArrow()
  }, [controls])

  const animateLight = async () => {
    await lightControls.start({ x: 300, transition: { duration: 2, ease: "easeInOut" } })
    await lightControls.start({ x: -50, transition: { duration: 0, delay: 0.5 } })
    if (!isComplete) {
      animateLight()
    }
  }

  const animateArrow = async () => {
    if (isDragging || isComplete) return
    await arrowControls.start({ x: 3, scale: 1.05, transition: { duration: 0.8, ease: "easeInOut" } })
    await arrowControls.start({ x: 0, scale: 1, transition: { duration: 0.8, ease: "easeInOut" } })
    if (!isDragging && !isComplete) {
      animateArrow()
    }
  }

  const handleDragStart = () => {
    setIsDragging(true)
    arrowControls.stop()
    arrowControls.set({ x: 0, scale: 1 }) // Reset arrow position and scale
  }

  const handleDrag = (event, info) => {
    if (info.offset.x > 0) {
      arrowControls.set({ x: 0, scale: 1 }) // Ensure arrow stays in place while dragging
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (x.get() > 250) { // If slid more than 250px (adjust as needed)
      setIsComplete(true)
      controls.start({ x: 300 })
      lightControls.stop()
    } else {
      controls.start({ x: 0 })
      animateArrow()
    }
  }

  const handleReset = () => {
    setIsComplete(false)
    setIsDragging(false)
    controls.start({ x: 0 })
    x.set(0)
    animateLight()
    animateArrow()
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <Box
          width="100%"
          maxWidth="400px"
          p={3}
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow={3}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            Slide to Continue
          </Typography>
          <SliderContainer ref={constraintsRef} style={{ background }}>
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                width: "50px",
              }}
              animate={lightControls}
              initial={{ x: -50 }}
            />
            <SliderHandle
              drag={!isComplete ? "x" : false}
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              animate={controls}
              style={{ x: springX }}
            >
              <motion.div animate={arrowControls}>
                <ArrowCircleRight style={{ color: "white" }} />
              </motion.div>
            </SliderHandle>
            {!isDragging && !isComplete && (
              <SliderText variant="body1" fontWeight="medium">
                Slide to continue
              </SliderText>
            )}
          </SliderContainer>
          {isComplete && (
            <Box mt={3} textAlign="center">
              <Typography variant="body1" color="text.primary" mb={2}>
                Slide complete!
              </Typography>
              <Link href="/register" passHref style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary" fullWidth>
                  Register Now
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleReset}
                style={{ marginTop: "8px" }}
              >
                Reset Slider
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  )
}