FROM mcr.microsoft.com/devcontainers/base:bullseye

USER root

RUN apt-get update \
    && apt-get install -y sudo python3-pip nodejs npm unixodbc-dev gcc g++ make \
    && npm install -g npm@latest webpack webpack-cli \
    && echo vscode ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

RUN mkdir -p /workspaces \
    && chown -R vscode:vscode /workspaces

USER vscode

RUN pip install --user pipx && python3 -m pipx ensurepath
