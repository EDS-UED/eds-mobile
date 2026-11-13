/** Auto-generated from packages/tokens/spec/motion — Base → Recipe → Semantic */

export const mobileMotionSprings = {
  "default": {
    "damping": 19,
    "stiffness": 130,
    "mass": 1
  },
  "interactive": {
    "damping": 72,
    "stiffness": 1755,
    "mass": 1
  },
  "navigation": {
    "damping": 29,
    "stiffness": 273,
    "mass": 1
  },
  "sheet": {
    "damping": 23,
    "stiffness": 171,
    "mass": 1
  },
  "modal": {
    "damping": 30,
    "stiffness": 273,
    "mass": 1
  },
  "control": {
    "damping": 37,
    "stiffness": 503,
    "mass": 1
  },
  "press": {
    "damping": 46,
    "stiffness": 560,
    "mass": 1
  },
  "press-release": {
    "damping": 17,
    "stiffness": 350,
    "mass": 1
  },
  "drag": {
    "damping": 32,
    "stiffness": 385,
    "mass": 1
  },
  "bouncy": {
    "damping": 20,
    "stiffness": 224,
    "mass": 1
  },
  "gentle": {
    "damping": 19,
    "stiffness": 110,
    "mass": 1
  },
  "snappy": {
    "damping": 46,
    "stiffness": 560,
    "mass": 1
  }
} as const;

export const mobileMotionTimings = {
  "navigationPush": {
    "duration": 350,
    "easing": [
      0.32,
      0.72,
      0,
      1
    ]
  },
  "easeInOut": {
    "duration": 350,
    "easing": [
      0.42,
      0,
      0.58,
      1
    ]
  },
  "easeOut": {
    "duration": 300,
    "easing": [
      0,
      0,
      0.58,
      1
    ]
  },
  "easeIn": {
    "duration": 250,
    "easing": [
      0.42,
      0,
      1,
      1
    ]
  }
} as const;

export const mobileMotionHaptics = {
  "selection": "selection",
  "light": "light",
  "medium": "medium",
  "heavy": "heavy",
  "success": "success",
  "warning": "warning",
  "error": "error"
} as const;

export const mobileMotionInteraction = {
  "velocityAware": true,
  "interruptible": true,
  "preserveVelocity": true
} as const;

export const mobileMotionRecipes = {
  "press": {
    "label": "Press",
    "spring": "press",
    "timing": null,
    "haptic": "light",
    "semanticClass": "motion-tap",
    "velocityAware": false,
    "interruptible": false
  },
  "press-scale-out": {
    "label": "Press Scale Out",
    "spring": "press-release",
    "timing": null,
    "haptic": null,
    "semanticClass": null,
    "velocityAware": false,
    "interruptible": false
  },
  "interactive": {
    "label": "Interactive",
    "spring": "interactive",
    "timing": null,
    "haptic": "selection",
    "semanticClass": null,
    "velocityAware": true,
    "interruptible": true
  },
  "navigation": {
    "label": "Navigation",
    "spring": "navigation",
    "timing": "navigationPush",
    "haptic": null,
    "semanticClass": "motion-page",
    "velocityAware": false,
    "interruptible": false
  },
  "sheet": {
    "label": "Sheet",
    "spring": "sheet",
    "timing": null,
    "haptic": "selection",
    "semanticClass": "motion-flotation",
    "velocityAware": false,
    "interruptible": false
  },
  "modal": {
    "label": "Modal",
    "spring": "modal",
    "timing": null,
    "haptic": null,
    "semanticClass": "motion-flotation",
    "velocityAware": false,
    "interruptible": false
  },
  "control": {
    "label": "Control",
    "spring": "control",
    "timing": null,
    "haptic": "selection",
    "semanticClass": "motion-deform",
    "velocityAware": false,
    "interruptible": false
  },
  "enter": {
    "label": "Enter",
    "spring": null,
    "timing": "easeIn",
    "haptic": null,
    "semanticClass": "motion-focus",
    "velocityAware": false,
    "interruptible": false
  },
  "exit": {
    "label": "Exit",
    "spring": null,
    "timing": "easeOut",
    "haptic": null,
    "semanticClass": null,
    "velocityAware": false,
    "interruptible": false
  },
  "expand": {
    "label": "Expand",
    "spring": "gentle",
    "timing": null,
    "haptic": null,
    "semanticClass": "motion-layout",
    "velocityAware": false,
    "interruptible": false
  },
  "collapse": {
    "label": "Collapse",
    "spring": "gentle",
    "timing": "easeOut",
    "haptic": null,
    "semanticClass": "motion-layout",
    "velocityAware": false,
    "interruptible": false
  },
  "layout-deform": {
    "label": "Layout Deform",
    "spring": "gentle",
    "timing": null,
    "haptic": null,
    "semanticClass": "motion-layout-deform",
    "velocityAware": false,
    "interruptible": false
  },
  "glass-press": {
    "label": "Glass Press",
    "spring": "press",
    "timing": null,
    "haptic": "light",
    "semanticClass": "motion-glass-interactive",
    "velocityAware": false,
    "interruptible": false
  },
  "glass-shimmer": {
    "label": "Glass Shimmer",
    "spring": null,
    "timing": "easeIn",
    "haptic": null,
    "semanticClass": "motion-glass-shimmer",
    "velocityAware": false,
    "interruptible": false
  },
  "glass-morph": {
    "label": "Glass Morph",
    "spring": "gentle",
    "timing": null,
    "haptic": null,
    "semanticClass": "motion-glass-morph",
    "velocityAware": false,
    "interruptible": false
  },
  "scroll-fade": {
    "label": "Scroll Fade",
    "spring": null,
    "timing": null,
    "haptic": null,
    "semanticClass": null,
    "velocityAware": false,
    "interruptible": false
  },
  "drag": {
    "label": "Drag",
    "spring": "drag",
    "timing": null,
    "haptic": "light",
    "semanticClass": null,
    "velocityAware": true,
    "interruptible": true
  },
  "dismiss": {
    "label": "Dismiss",
    "spring": "interactive",
    "timing": "easeOut",
    "haptic": null,
    "semanticClass": "motion-flotation",
    "velocityAware": true,
    "interruptible": false
  },
  "success": {
    "label": "Success",
    "spring": "bouncy",
    "timing": null,
    "haptic": "success",
    "semanticClass": null,
    "velocityAware": false,
    "interruptible": false
  },
  "error": {
    "label": "Error",
    "spring": "press",
    "timing": "easeOut",
    "haptic": "error",
    "semanticClass": null,
    "velocityAware": false,
    "interruptible": false
  },
  "loading": {
    "label": "Loading",
    "spring": null,
    "timing": "easeInOut",
    "haptic": null,
    "semanticClass": null,
    "velocityAware": false,
    "interruptible": false
  }
} as const;

export const mobileMotionCompositions = {
  "ios-navigation": {
    "id": "ios-navigation",
    "label": "iOS Navigation",
    "semanticClass": "motion-page",
    "push": {
      "recipe": "navigation"
    },
    "pop": {
      "recipe": "navigation"
    },
    "interactivePop": {
      "recipe": "interactive"
    }
  },
  "ios-sheet": {
    "id": "ios-sheet",
    "label": "iOS Sheet",
    "semanticClass": "motion-flotation",
    "presentation": {
      "recipe": "sheet"
    },
    "interaction": {
      "recipe": "interactive"
    },
    "dismiss": {
      "recipe": "dismiss"
    },
    "snapPoints": [
      0.25,
      0.5,
      0.75,
      1
    ],
    "haptic": {
      "snap": "selection"
    }
  },
  "ios-modal": {
    "id": "ios-modal",
    "label": "iOS Modal",
    "semanticClass": "motion-flotation",
    "presentation": {
      "recipe": "modal"
    },
    "content": {
      "recipe": "modal",
      "scaleFrom": "motion-scale-present",
      "opacityFrom": "motion-opacity-hidden"
    },
    "backdrop": {
      "opacity": "motion-opacity-dim"
    },
    "dismiss": {
      "recipe": "exit",
      "springRef": "default"
    }
  },
  "ios-popover": {
    "id": "ios-popover",
    "label": "iOS Popover",
    "semanticClass": "motion-flotation",
    "presentation": {
      "recipe": "modal"
    },
    "scale": {
      "from": "motion-scale-present",
      "to": "1"
    },
    "opacity": {
      "from": "motion-opacity-hidden",
      "to": "motion-opacity-visible"
    }
  },
  "ios-large-title": {
    "id": "ios-large-title",
    "label": "iOS Large Title",
    "type": "scroll-linked",
    "scrollRange": {
      "start": 0,
      "end": 44
    },
    "scale": {
      "from": 1,
      "to": 0.82
    },
    "opacity": {
      "from": 1,
      "to": 0
    },
    "navigationBar": {
      "opacityFrom": 0,
      "opacityTo": 1
    }
  },
  "shared-element": {
    "id": "shared-element",
    "label": "Shared Element",
    "recipe": "layout-deform",
    "timingRef": "easeInOut",
    "notes": [
      "Asset Card → Detail · 非普通 page transition"
    ]
  },
  "list-insert": {
    "id": "list-insert",
    "label": "List Insert",
    "recipe": "enter",
    "springRef": "default"
  },
  "list-delete": {
    "id": "list-delete",
    "label": "List Delete",
    "recipe": "interactive"
  },
  "transaction": {
    "id": "transaction",
    "label": "Crypto Transaction",
    "states": [
      "pending",
      "confirming",
      "confirmed"
    ],
    "recipe": "layout-deform",
    "success": {
      "recipe": "success"
    }
  },
  "swap": {
    "id": "swap",
    "label": "Crypto Swap",
    "recipe": "enter",
    "timingRef": "easeInOut",
    "notes": [
      "Token A ↔ Token B · Quote morph"
    ]
  },
  "security-signing": {
    "id": "security-signing",
    "label": "Security Signing",
    "presentation": {
      "recipe": "sheet"
    },
    "success": {
      "recipe": "success"
    },
    "error": {
      "recipe": "error"
    }
  },
  "wallet-connect": {
    "id": "wallet-connect",
    "label": "Wallet Connect",
    "states": [
      "idle",
      "connecting",
      "connected"
    ],
    "recipe": "enter",
    "haptic": {
      "connected": "success"
    }
  }
} as const;

export const mobileMotionSemanticMap = {
  "motion-tap": {
    "recipe": "press",
    "spring": "press",
    "timing": null
  },
  "motion-page": {
    "recipe": "navigation",
    "spring": "navigation",
    "timing": "navigationPush"
  },
  "motion-flotation": {
    "recipe": "sheet",
    "spring": "sheet",
    "timing": null
  },
  "motion-deform": {
    "recipe": "control",
    "spring": "control",
    "timing": null
  },
  "motion-focus": {
    "recipe": "enter",
    "spring": null,
    "timing": "easeIn"
  },
  "motion-layout": {
    "recipe": "expand",
    "spring": "gentle",
    "timing": null
  },
  "motion-layout-deform": {
    "recipe": "layout-deform",
    "spring": "gentle",
    "timing": null
  },
  "motion-glass-interactive": {
    "recipe": "glass-press",
    "spring": "press",
    "timing": null
  },
  "motion-glass-shimmer": {
    "recipe": "glass-shimmer",
    "spring": null,
    "timing": "easeIn"
  },
  "motion-glass-morph": {
    "recipe": "glass-morph",
    "spring": "gentle",
    "timing": null
  },
  "motion-glass-none": {
    "spring": null,
    "timing": null
  }
} as const;

export const mobileMotionScenarioById = {
  "press": "motion-tap",
  "focus": "motion-focus",
  "layout": "motion-layout",
  "flotation": "motion-flotation",
  "deform": "motion-deform",
  "page": "motion-page",
  "layout-deform": "motion-layout-deform",
  "glass-interactive": "motion-glass-interactive",
  "glass-shimmer": "motion-glass-shimmer",
  "glass-morph": "motion-glass-morph",
  "glass-none": "motion-glass-none"
} as const;

export const mobileMotion = {
  spring: mobileMotionSprings,
  timing: mobileMotionTimings,
  haptic: mobileMotionHaptics,
  interaction: mobileMotionInteraction,
} as const;

export default mobileMotion;
