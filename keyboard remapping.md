# Key mapping in Linux for proficient typing. 

<span style="color: #999999;">08 Jul, 2023 - Kaddy Marindi</span>

For heavy computer users, a keyboard is often a primary interface for interacting with the system when typing, navigating, and using shortcuts. Some of the most frequently used keys such as Esc, Ctrl, and arrow keys are far from the home row keys. We have to overextend our fingers to press them; consequently, causing errors that can disrupt the typing flow and reduce productivity.

In this article, I'll show you how to remap Esc, Ctrl and arrows keys in Linux, X windows systems, to easily accessible locations on the keyboard using two tools: `xmodmap` and `xcape`. If you are getting confused when following along, refer to my `xmodmap` configuration on [GitHub](https://github.com/kaddy120/dotfile/blob/master/.xmodmap), which most part of this article is base on. 

## Understanding xmodmap key mapping concepts

`xmodmap` is a utility that allows you to modify keymaps and pointer button mappings. To use `xmodmap` to modify keymaps, you need to understand three primary concepts: `keycode`, `keysym`, and `modifiers`. 

### Keycode and keysym

- `keycode` is a number associated with the physical key that is sent to the kernel when a key is pressed, and is used as a physical key identifier for keymapping. 

- `keysym` is a key label referred using a symbol name that can be mapped to a `keycode`. You may already be familiar with the common `keysym`, symbol names, such as Escape, Tab, space, a to z, and A to Z. For an exhaustive `keysyms` list, refer to [this link](https://wiki.linuxquestions.org/wiki/List_of_keysyms) or `/usr/include/X11/keysymdef.h` (ignore XK_ prefix on the `keysym` names). When a key is pressed, a corresponding `keysym` visual symbol is generated, or behavior takes effect.

In a later section, I'll will show you how to determine the `keycode` and `keysym` for the keys you want to remap.

### Modifiers

`modifiers` are keyboard keys that are often used in conjunction with other keys, and do not produce any visual character when pressed alone. Some of the common modifiers include Shift, Ctrl, Alt, Super (Windows) keys, Esc, and CapsLock. When a modifier is pressed with another key, it produces non-default behavior. For instance, `Shift+1` produces `!` , `Shift+a` produces `A`. `Modifiers` are handy for application shortcuts.

To print out the standard modifier table in your system, run the following command:

```bash
 $ xmodmap -pk
```
The output looks like the following:

```
xmodmap:  up to 3 keys per modifier, (keycodes in parentheses):

shift       Shift_L (0x32),  Shift_R (0x3e)
lock        Caps_Lock (0x42) 
control     Control_R (0x69),  Control_L (0x85),  Control_L (0xce)
mod1        Alt_L (0x40),  Meta_L (0xcd)
mod2        Num_Lock (0x4d)
mod3      
mod4        Super_L (0x25),  Super_R (0x86),  Hyper_L (0xcf)
mod5        ISO_Level3_Shift (0x5c),  Mode_switch (0xcb)
```


Okay modifier are tricky bussiness. YOu out to explain them better, most escpecially here..........
This is a list of keys that trigger the modifier names on the left. The left You can add, remove, or clear the key(s) assigned to the modifier.

## Keymapping using xmodmap

### precaution

The idea of manually key mapping might seem daunting at first owing to a fear of rendering your keyboard dysfunctional if you make a mistake. However, by default, the key mappings are not persisted when the system reboots, so there is nothing to worry about. Nevertheless, you don't want to keep on rebooting your system every time you make a mistake.

| Note: Before you proceed, save the current keymaps in an expression format to a file, `~/.xmodmap_default`, which can be fed back to `xmodmap` to revert back to the current mapping. To save the current keymaps in `~/.xmodmap_default`, run the following command: |
| ---                                                                                                                                                                                                                                                                                                                                 |
```bash
 $ xmodmap -pke > ~/.xmodmap_default 
```

| Tip: '~' refers to your home directory. For example, `~/.file.txt` means that a file called `.file.txt` is place in your home directory `$HOME`. |
| ---------                                                                                                                                        |

The content of `~/.xmodmap_default` looks like the following:

```
 ...
 keycode  38 = a A
 keycode  39 = s S s S scaron Scaron scaron Scaron
 keycode  40 = d D d D U1E13 U1E12 U1E13 U1E12
 ...
```
The first line means that the keycode `38` is mapped to a character "a"; and to character "A" when pressed with Shift held down.

### xmodmap usage

Since you've preserved your default keymaps, we can now solidify the concepts you have learned thus far by using `xmodmap` to do some simple keymapping, swapping keys and create a key alias. Well do this in the terminal using the following command syntax:

```bash
 $ xmodmap -e <Expression> 
```
Where `<Exrpession>` is keymapping expression for `xmodmap`. You can find them and their description in table 1 below. 


Table 1: `xmodmap` expressions and description
| Expression rule               | description                               |
|-------------------------------|-------------------------------------------|
| keycode NUMBER = [KEYSYM ...] | map keycode to given keysyms              |
| keysym KEYSYM = [KEYSYM ...]  | look up keysym and do a keycode operation |
| clear MODIFIER                | remove all keys for this modifier         |
| add MODIFIER = KEYSYM ...     | add the keysyms to the modifier           |
| remove MODIFIER = KEYSYM ...  | remove the keysyms from the modifier      |

Where:

- `NUMBER` is a `keycode`; it can be in a decimal, octal, or hex form.
- `KEYSYM` is a valid Key Symbol name. 
- `MODIFIER` is one of the eight modifier names:  `Shift`, `Lock`, `Control`, `Mod1`, `Mod2`, `Mod3`, `Mod4`, or `Mod5`.  

| Note: `KEYSYM` is case sensitive. |
| ---                         |
 
#### swap two character keys (q and w) 

First, lets determine the `keycode` and `keysym` for a key that we want to swap, 'q' and 'w', by run the following script:

```bash
 $ xev | awk '/state 0x.*, keycode / { print $3, $4, $5, $7; fflush() }'
```

When an Event tester window will shows up, focus on it by moving your mouse cursor to it. Then press key q and w. Their `keycode` and `keysym` will print in the terminal.  

```bash
 # lets swap q and w
 $ xmodmap -e "keycode 24 = q Q"
 $ xmodmap -e "keycode 25 = w W"
```
Now press q and w to see what happens, when you press a key q you are suppose to get a character w, and vice verse with w. 

If you want to create an alias for key, for instance, when you press 'a' you want to get 'e', run the following command. 

``` bash
 
 # when is keysym remapping, a keycode is looked up for Key Symbol a, then if found, it assigned the keysym on the right. 
 $ xmodmap -e "keysym a = e E"
```
This is different from swapping, you can think of this as memory pointer. First, `keysym` on the left, a, is resolved to its keycode x, then `keycode x = e E` is applied implicitly.

Now, you can revert back to the normal keyboard behavior by running.

```
 $ xmodmap ~/.xmodmap_default
```

### Swap modifiers, Ctrl and Super key 

Swapping the left Ctrl and Super (Window) keys can be can make it more convenient for those who use the Ctrl key more frequently, as the Super key can be more easily accessible without lifting fingers from the home row. This can lead to more efficient use of keyboard shortcuts and overall productivity.

To swap modifiers, first remove the `keysym` names that you want to swap from the modifier table using:

```bash
$ xmodmap -e "remove mod4 = Super_L"
$ xmodmap -e "remove Control = Control_L"
```

Then swap the keys so that Super_L is triggered when you press Control_L and vice versa. 
```bash
$ xmodmap -e "keysym Control_L = Control_L NoSymbol Control_L"
$ xmodmap -e "keysym Super_L = Super_L Super_L NoSymbol Super_L"
```
If this were regular keys you would be done but they are modifiers. You have to add the keys back to the modifiers by running: 

```bash
$ xmodmap -e "add mod4 = Super_L"
$ xmodmap -e "add Control = Control_L"
 ```
 
### Using a file 

Keymapping in command line is tedious and error-prone. Instead, it is preferred to write the expression rule in a file to be passed to `xmodmap`. The confessional name for this file is `~/.Xmodmap`. 

To create this file, open a text editor and add the desired key mappings as expression rules, one per line. For swapping the left Ctrl and the Super key, create a file `~/.Xmodmap` with the following contents:

```
 ! Swap Control_L and Super_L
 
 remove control = Control_L
 remove mod4 = Super_L

 keysym Super_L = Control_L NoSymbol Control_L
 keysym Control_L = Super_L NoSymbol Super_L
 
 ! Keysyms on the left hand side of the = sign are looked up before any changes
 ! are made; keysyms on the right are looked up after all of those on the left
 ! have been resolved to their keycode. This makes it possible to swap modifier keys.
 
 add mod4 = Super_L 
 add control = Control_L
```
Once the file has been created, apply these key mapping by running:

```bash
 $ xmodmap ~/.xmodmap_default
 $ xmodmap ~/.Xmodmap
 ```
 
## Make h, j, k and l to behave as arrow function. 

Arrow keys are far at the vertex of the keyboard and their not constantly positioned the same and they vary in size over the keyboards. Pressing arrow key will slow down even a veteran typist who can type above 100 wmp. You have to lift your hand from the home row key; look at you keyboard, then press them. It's tedious. Fortunately, Vim has introduced me to a new way of having arrow keys readily available on my fingertips through the h, j, k, and l keys, which felt easy and efficient. This section shows how to map the arrow keys to h, j, and l and still retain their function, but to do this we have to understand key level, which well in the subsequent section.

### Key levels 

In the X Window System, every key has 8 `keysym levels` that can optionally be assigned a `keysysm`. When looking at the output of `xmodmap -pke`, we see lines like `keycode  40 = d D d D U1E13 U1E12 U1E13 U1E12` and `keycode  36 = Return NoSymbol Return`, which can be elaborated by the following syntax:

```
keycode KEYCODE = <keysym-level1> <keysym-level2> ... <keysym-level8>
```
`NoSymbol` means that a level is not set to any character. 

The `keysym levels` acts like keyboard layers. The first layer is when pressing a key without any modifier; the second layer is when pressing a key with Shift, for instance, pressing `Shift+a` produces `A` and `Shit+1` produces `!`. All 8 `keysym levels` have a particular combination of modifier to choose them, which i have provided below. 

1. Key
2. Shift+Key
3. Mode_switch+Key
4. Mode_switch+Shift+Key
5. ISO_Level3_Shift+Key
6. ISO_Level3_Shift+Shift+Key
 
Ensure that your modifier table contains Mode_switch for by running:

```
 $ xmodmap | grep "Mode_switch"
```
If you don't see an output with the word "Mode_swich", then add it by appending the following line of code to `~/.Xmodmap`:  

```
add mod5 Mode_switch
```

Map the CapsLock to `Mode_Switch`, by appending the following line of code to `~/.Xmodmap`: 

```
remove lock = Caps_Lock
keysym Caps_Lock = Mode_switch 
```

Then run: 

```
$ xmodmap ~/.default_Xmodmap
$ xmodmap ~/.Xmodmap
```

For illustration, I'll demonstrate the first 4 layers, lets map the key q on the keyboard to the following: 

```
 $ xmodmap -e "keycode 24 = q Q a b"
```
Press:

| level | press key 'q' +            | output |
|-------|----------------------------|--------|
| 1     | none                       | q      |
| 2     | Shift                      | Q      |
| 3     | CapsLock                   | a      |
| 4     | CapsLock + Shift           | b      |
 
If you have ISO_Level3_Shift keysym mappped on your keyboard, you can access up to level 6. The constrain is that most keyboard, especial laptop keyboard, don't have enough keys to add ISO_level3_shift.  

### Mapping arrows 

To map arrow keys to level 3 keysym of h, j, k and L, append the following lines of code to `~/Xmodmap`. 

```
! map h, j, k, l to arrow key when pressed in combination with Mode_switch
keycode 43 = h H Left Left  
keycode 44 = j J Down Down  
keycode 45 = k K Up Up    
keycode 46 = l L Right Right  
```

Then run: 

```
$ xmodmap ~/.default_Xmodmap
$ xmodmap ~/.Xmodmap
```
Hold CapsLock and press either h, j, k or L to see if they behave as arrow keys. 

### Alternative Level 3 Chooser

You can choose any other modifier key that you can press with you left hand side as a level 3 chooser that you hardly use. The reason for choosing a modifier on the left is so that will you are hold the modifier with the left hand you can then easily press h, j, k or l with the right hand. 

The left Alt, keycode 66 is another better alternative if you are not using it for any purpose. Then map AltGr (right Alt) to Alt_L keysym. You can do this by appending the following code block to `~/.Xmodmap`.

```
 ! Map the left Alt to Mode_switch
 keysym 66 = Mode_switch 
 
 ! Map AltGr to Alt_L
 keycode 108 = Alt_L NoSybmol Alt_L
```

## Make the Caps_Lock to also function as Esc

If we map Esc to Caps_lock, we'll lose the functionality for h,k, k and l as arrow function, since this will override `Modswitch` that is already mapped to Caps_lock for level 3 chooser. I'll introduce you to `xcape` to solve limitation. `xcape` is a tool that allows a modifier key to be used as another key it is pressed and released on its own, without pressing another key in conjunction.  

### `xcape` installation

On Dabian-base distribution, run:
```bash
 $ sudo apt-get install xcape
```

On Archi-base distribution, run:
```bash
 $ sudo packman -S xcape
```

If you cannot find `xcape` in your system package repository, you can find a minimal build instruction on [xcape GitHub repository](https://github.com/alols/xcape#minimal-building-instructions).

### xcape usage

Once you understand `xmomap`, understanding `xcape` should be fairly simple, thus, I won't go in details explaining how it works; I'll only demostrate how to use it for the purpose of this article. 

```
 $ xcape -e <Expression>
```
Where `<Expression>` is equal to `ModKey=Key[|OtherKey]`.

If you want to use CapsLock as Escape and you are already using it as `Mode_switch` for arrow keys, you can make it genereate Escape when pressed and released on it's own by running the following command:

```bash
 $ xcape -e 'Mode_Switch=Escape'
```

### `xcape` limitations

`xcape` limitation is that it sends multiple key event when you press a key once, which can result in unintended behavior. However, when using `xcape` for an Esc, this behavior is negligible.  

### Make your keymapping permanent. 

For applying your keymap automatically every time you start your Linux system, use X [autostart](https://wiki.archlinux.org/title/autostartin) script. Create a file called `~/.xinitrc` and add the following file content.
```bash
# ~/.xinitrc
# This file is sourced when running startx and 
#    other programs which call xinit
# As in all Bash/sh scripts lines starting with 
#    '#' are comments
[[ -f ~/.Xmodmap ]] && xmodmap ~/.Xmodmap
exec_always --no-startup-id xcape -e 'Mode_Switch=Escape'
``` 

### Reference
https://wiki.archlinux.org/title/autostarting
https://en.wikipedia.org/wiki/Modifier_key
##
