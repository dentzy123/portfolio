import tkinter as tk

class ModernCalculator:
    def __init__(self, root):
        self.root = root~
        self.root.title("Calculator")
        self.root.geometry("320x450")
        self.root.resizable(False, False)
        
        # Modern Minimalist Color Palette (Dark Theme)
        self.bg_color = "#121212"
        self.display_bg = "#121212"
        self.text_color = "#FFFFFF"
        self.btn_bg = "#2C2C2C"
        self.btn_active = "#3E3E3E"
        self.accent_color = "#FF9F0A"  # iOS style orange
        self.accent_active = "#FFB340"
        self.clear_color = "#A5A5A5"
        self.clear_active = "#D4D4D4"
        
        # Fonts
        self.display_font = ("Helvetica", 40, "bold")
        self.btn_font = ("Helvetica", 18)
        
        self.root.configure(bg=self.bg_color)
        self.equation = ""
        
        self._create_ui()

    def _create_ui(self):
        # Display Frame
        display_frame = tk.Frame(self.root, bg=self.display_bg)
        display_frame.pack(expand=True, fill="both", pady=(20, 10))

        self.display_label = tk.Label(
            display_frame, 
            text="0", 
            anchor="e", 
            bg=self.display_bg, 
            fg=self.text_color, 
            font=self.display_font,
            padx=20
        )
        self.display_label.pack(expand=True, fill="both")

        # Buttons Frame
        buttons_frame = tk.Frame(self.root, bg=self.bg_color)
        buttons_frame.pack(expand=True, fill="both", padx=10, pady=10)

        # Button Layout
        buttons = [
            ('C', 0, 0), ('±', 0, 1), ('%', 0, 2), ('/', 0, 3),
            ('7', 1, 0), ('8', 1, 1), ('9', 1, 2), ('*', 1, 3),
            ('4', 2, 0), ('5', 2, 1), ('6', 2, 2), ('-', 2, 3),
            ('1', 3, 0), ('2', 3, 1), ('3', 3, 2), ('+', 3, 3),
            ('0', 4, 0, 2), ('.', 4, 2), ('=', 4, 3)
        ]

        for btn in buttons:
            text = btn[0]
            row = btn[1]
            col = btn[2]
            colspan = btn[3] if len(btn) > 3 else 1
            
            # Determine button colors based on their function
            bg = self.btn_bg
            active_bg = self.btn_active
            fg = self.text_color
            
            if text in ['/', '*', '-', '+', '=']:
                bg = self.accent_color
                active_bg = self.accent_active
            elif text in ['C', '±', '%']:
                bg = self.clear_color
                active_bg = self.clear_active
                fg = "#000000"

            self._create_button(buttons_frame, text, row, col, colspan, bg, fg, active_bg)

        # Grid configuration for even spacing
        for i in range(5):
            buttons_frame.rowconfigure(i, weight=1)
        for i in range(4):
            buttons_frame.columnconfigure(i, weight=1)

    def _create_button(self, parent, text, row, col, colspan, bg, fg, active_bg):
        button = tk.Button(
            parent, 
            text=text, 
            font=self.btn_font, 
            bg=bg, 
            fg=fg,
            activebackground=active_bg,
            activeforeground=fg,
            relief="flat",
            borderwidth=0,
            command=lambda t=text: self.on_button_click(t)
        )
        button.grid(row=row, column=col, columnspan=colspan, sticky="nsew", padx=4, pady=4)

    def on_button_click(self, char):
        if char == 'C':
            self.equation = ""
        elif char == '=':
            try:
                # Replace visual operators with Python operators
                eval_eq = self.equation.replace('×', '*').replace('÷', '/')
                result = str(eval(eval_eq))
                # Remove decimal if it's a whole number
                self.equation = result[:-2] if result.endswith(".0") else result
            except ZeroDivisionError:
                self.equation = "Error"
            except Exception:
                self.equation = "Error"
        elif char == '±':
            if self.equation and self.equation[0] == '-':
                self.equation = self.equation[1:]
            elif self.equation:
                self.equation = '-' + self.equation
        elif char == '%':
            try:
                self.equation = str(float(self.equation) / 100)
            except Exception:
                pass
        else:
            if self.equation == "Error" or self.equation == "0":
                self.equation = ""
            self.equation += str(char)

        # Update display
        self.display_label.config(text=self.equation if self.equation else "0")

if __name__ == "__main__":
    root = tk.Tk()
    app = ModernCalculator(root)
    root.mainloop()