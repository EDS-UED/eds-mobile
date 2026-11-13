package expo.modules.edssmoothcorner

import android.graphics.Color
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class EdsSmoothCornerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EdsSmoothCorner")

    View(EdsSmoothCornerView::class) {
      Name("EdsSmoothCornerView")

      /** dp；< 0 = 跟随父 View 的 RN `borderRadius`（父层用 Reanimated 动画圆角时逐帧同步）。 */
      Prop("radius") { view: EdsSmoothCornerView, radius: Float ->
        view.setRadiusDp(radius)
      }

      /** Figma corner smoothing（0–1）。 */
      Prop("smoothing") { view: EdsSmoothCornerView, smoothing: Float ->
        view.setSmoothing(smoothing)
      }

      Prop("strokeWidth") { view: EdsSmoothCornerView, width: Float ->
        view.setStrokeWidthDp(width)
      }

      /** RN `processColor` 结果（ARGB int）。 */
      Prop("strokeColor") { view: EdsSmoothCornerView, color: Int? ->
        view.setStrokeColor(color ?: Color.TRANSPARENT)
      }
    }
  }
}
