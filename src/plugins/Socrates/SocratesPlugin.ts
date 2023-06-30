import { Setting, TFile } from 'obsidian';
import AIFeed from 'src/AIFeed';
import ViewPluginBase from 'src/components/ViewPluginBase';
import ArcanaPlugin from 'src/main';
import { SocratesView } from 'src/plugins/Socrates/SocratesView';
import { removeFrontMatter } from 'src/utilities/DocumentCleaner';

export default class SocratesPlugin extends ViewPluginBase {
  private settings = {
    priorInstruction: '',
    //  usingWeb: false,
    //  serpApiToken: '',
    agent_folder: 'Arcana/Agents',
  };

  private getPriorInstruction(): string {
    return this.settings.priorInstruction;
  }
  private getAgentFolder(): string {
    return this.settings.agent_folder;
  }

  public async onload(): Promise<void> {
    await super.onload();

    this.settings = this.arcana.settings.PluginSettings['Socrates'] ?? {
      priorInstruction: '',
      // usingWeb: false,
      // serpApiToken: '',
      agent_folder: 'Arcana/Agents',
    };
  }

  public addSettings(containerEl: HTMLElement) {
    containerEl.createEl('h2', { text: 'Socrates' });

    new Setting(containerEl)
      .setName("Socrates's System Message")
      .setDesc('The prior instruction given to Socrates')
      .addTextArea(text => {
        text
          .setPlaceholder('')
          .setValue(this.settings.priorInstruction)
          .onChange(async (value: string) => {
            this.settings.priorInstruction = value;
            this.arcana.settings.PluginSettings['Socrates'] = this.settings;
            await this.arcana.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Conversation Agent Folder')
      .setDesc('The folder from which to load conversation agent templates.')
      .addText(text => {
        text
          .setPlaceholder('')
          .setValue(this.settings.agent_folder)
          .onChange(async (value: string) => {
            this.settings.agent_folder = value;
            this.arcana.settings.PluginSettings['Socrates'] = this.settings;
            await this.arcana.saveSettings();
          });
      });
    /*
    new Setting(containerEl)
      .setName('With Web Search')
      .setDesc('Whether to give Socrates access to the web')
      .addToggle(toggle => {
        toggle
          .setValue(this.settings.usingWeb)
          .onChange(async (value: boolean) => {
            this.settings.usingWeb = value;
            this.arcana.settings.PluginSettings['Socrates'] = this.settings;
            await this.arcana.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Serp API Token')
      .setDesc('The Serp API Token to use for web searches')
      .addText(text => {
        text
          .setValue(this.settings.serpApiToken)
          .onChange(async (value: string) => {
            this.settings.serpApiToken = value;
            this.arcana.settings.PluginSettings['Socrates'] = this.settings;
            await this.arcana.saveSettings();
          });
      });
    //.setDisabled(!this.settings.usingWeb);
    */
  }

  constructor(arcana: ArcanaPlugin) {
    super(arcana, 'socrates-view', 'brain-cog', 'Socrates', () =>
      SocratesView(arcana, this.getAgentFolder.bind(this))
    );
  }
}
