# --- 프롬프트에서 변수/함수 확장 허용 ---
setopt prompt_subst

# --- Git branch + 변경사항 표시 설정 ---
autoload -Uz vcs_info

precmd() {
  vcs_info
}

# %b = 브랜치명, %c = staged, %u = unstaged, %a = action
zstyle ':vcs_info:git:*' formats '%F{cyan} %b%f %F{yellow}%c%f%F{red}%u%f'
zstyle ':vcs_info:git:*' actionformats '%F{cyan} %b|%a%f %F{yellow}%c%f%F{red}%u%f'

zstyle ':vcs_info:*' stagedstr '●'
zstyle ':vcs_info:*' unstagedstr '✚'
zstyle ':vcs_info:*' check-for-changes true

# --- 파워라인 스타일 프롬프트 ---
PROMPT="%F{green}%1~%f ${vcs_info_msg_0_} %F{magenta}❯%f "
