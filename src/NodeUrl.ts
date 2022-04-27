import { NodeProvider, } from './models';

export const providerProtocol = {
  wss: 'wss',
  https: 'https',
};

class NodeUrl {
  private frozenProviders: NodeProvider[];

  private mutateProvider: NodeProvider | null;

  private abortSearch = false;

  public net: string;

  constructor(net: string) {
    this.net = net;
    this.frozenProviders = [];
  }

  private async getProviders(): Promise<string | void> {
    if (!this.frozenProviders.length) {
      this.frozenProviders = await NodeProvider.findAll({ where: { net: this.net, }, raw: true, });
    }
  }

  protected async getNewProvider(): Promise<string | void> {
    await this.getProviders();

    if (!this.mutateProvider) {
      const availableProvider = this.frozenProviders
        .find(({ protocol, reTry, }) => protocol === providerProtocol.wss && !!reTry)
        || this.frozenProviders
          .find(({ protocol, reTry, }) => protocol === providerProtocol.https && !!reTry);

      this.mutateProvider = availableProvider ? JSON.parse(JSON.stringify(availableProvider))
        : null;
    }

    if (!this.mutateProvider || !this.mutateProvider.providers.length || this.abortSearch) {
      return;
    }

    const url = this.mutateProvider.providers.find(({ urlReTry, }) => !!urlReTry)?.url;

    if (url) {
      this.mutateProvider.providers = this.mutateProvider.providers
        .map((info) => (info.url === url ? { ...info, urlReTry: info.urlReTry - 1, } : info));

      return url;
    }

    this.mutateProvider.reTry -= 1;

    if (this.mutateProvider.reTry < 1) {
      if (this.frozenProviders.every(({ reTry, }) => !reTry)) {
        return;
      }

      if (this.mutateProvider.isStop) {
        this.frozenProviders = this.frozenProviders.map((nodeProvider) => (
          nodeProvider.protocol === this.mutateProvider?.protocol ? {
            ...nodeProvider, reTry: 0,
          } : nodeProvider
        )) as NodeProvider[];
      }

      const hasHttp = this.frozenProviders
        .some(({ protocol, reTry, }) => protocol === providerProtocol.https && !!reTry);

      if (hasHttp && this.mutateProvider.protocol !== providerProtocol.https) {
        this.mutateProvider = JSON.parse(JSON.stringify(this.frozenProviders
          .find(({ protocol, reTry, }) => protocol === providerProtocol.https && !!reTry)));

        return this.getNewProvider();
      }

      this.mutateProvider = null;

      return this.getNewProvider();
    }

    const providers = this.frozenProviders
      .find(({ protocol, }) => protocol === this.mutateProvider?.protocol)?.providers;

    if (providers && providers.length) {
      this.mutateProvider.providers = [...providers];
    }

    return this.getNewProvider();
  }

  freeProvider(): void {
    this.frozenProviders = [];
  }
}

export default NodeUrl;
