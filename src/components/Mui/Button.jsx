import MuiButton from "@material-ui/core/Button";
import { compose, style, spacing, sizing, borders } from "@material-ui/system";
import { styled } from "@material-ui/styles";

const justify = style({
  props: "justify",
  cssProperty: "justify-content",
});
const align = style({
  props: "align",
  cssProperty: "ailgn-items",
});

export const Button = styled(MuiButton)(compose(spacing, sizing, borders, justify, align));
