

export const fonts = {
  

  primary: `"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
  secondary: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
};



export const typography = {
  text: {
      xxs: `
    font-size: 0.625rem;
    line-height: 1rem;
    font-weight: 400;
    `,
    xs: `
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 400;
    `,
    button: `
    font-size: 0.875rem;
    line-height: 1.5rem;
    font-weight: 500;
    `,
    sm: `
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 400;
    `,
    md: `
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 400;
    `,
    lg: `
    font-size: 1.125rem;
    line-height: 1.75rem;
    `,
    xl: `
    font-size: 1.25rem;
    line-height: 1.75rem;
    `,
  },
  head: {
    xxxs: `
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    `,
    xxs: `
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 400;
    `,
    xs: `
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 500;
    `,
    sm: `
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 400;
    `,
    md: `
    font-size: 2.25rem;
    line-height: 3rem;
    font-weight: 400;
    `,
    lg: `
    font-size: 3rem;
    line-height: 4rem;
    font-weight: 400;
    `,
    xl: `
    font-size: 4rem;
    line-height: 5.5rem;
    font-weight: 300;
    `,
    xxl: `
    font-size: 6rem;
    line-height: 8rem;
    font-weight: 300;
    `,
  },
};

for (const size in typography.text) {
  typography.text[size] += `
  font-family: ${fonts.secondary};
  
  `;
}

for (const size in typography.head) {
  typography.head[size] += `
  font-family: ${fonts.primary};
  
  `;
}
