package com.training50.backend.config;

import com.training50.backend.model.Exercicio;
import com.training50.backend.repository.ExercicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ExercicioRepository exercicioRepository;

    @Override
    public void run(String... args) {
        // Só insere se a tabela de exercícios ainda estiver vazia
        if (exercicioRepository.count() == 0) {
            Exercicio e1 = new Exercicio();
            e1.setNome("Alongamento de Braços");
            e1.setSeries("3 x 15s");
            e1.setCategoria("Mobilidade");
            e1.setNivel("Iniciante");
            e1.setContraIndicacao("nenhuma");
            e1.setVideoUrl("https://www.youtube.com/watch?v=exemplo1");
            e1.setInstrucoes("Eleve os braços lentamente acima da cabeça inspirando fundo e mantenha a postura reta sem forçar os ombros.");

            Exercicio e2 = new Exercicio();
            e2.setNome("Agachamento na Cadeira");
            e2.setSeries("3 x 10");
            e2.setCategoria("Pernas");
            e2.setNivel("Iniciante");
            e2.setContraIndicacao("joelho");
            e2.setVideoUrl("https://www.youtube.com/watch?v=exemplo2");
            e2.setInstrucoes("Sente-se e levante-se de uma cadeira firme mantendo os pés afastados na largura dos ombros e o abdômen contraído.");

            Exercicio e3 = new Exercicio();
            e3.setNome("Elevação de Calcanhar");
            e3.setSeries("3 x 12");
            e3.setCategoria("Pernas");
            e3.setNivel("Iniciante");
            e3.setContraIndicacao("nenhuma");
            e3.setVideoUrl("https://www.youtube.com/watch?v=exemplo3");
            e3.setInstrucoes("Apoie as mãos no encosto de uma cadeira ou parede e suba na ponta dos pés devagar, fortalecendo as panturrilhas.");

            Exercicio e4 = new Exercicio();
            e4.setNome("Rotação Suave de Ombros");
            e4.setSeries("3 x 10");
            e4.setCategoria("Articulações");
            e4.setNivel("Iniciante");
            e4.setContraIndicacao("ombro");
            e4.setVideoUrl("https://www.youtube.com/watch?v=exemplo4");
            e4.setInstrucoes("Gire os ombros para trás em movimentos circulares lentos e amplos para aliviar tensões cervicais.");

            Exercicio e5 = new Exercicio();
            e5.setNome("Marcha Estacionária Leve");
            e5.setSeries("3 x 30s");
            e5.setCategoria("Cardio");
            e5.setNivel("Iniciante");
            e5.setContraIndicacao("nenhuma");
            e5.setVideoUrl("https://www.youtube.com/watch?v=exemplo5");
            e5.setInstrucoes("Simule uma caminhada parada elevando levemente os joelhos em ritmo confortável e respirando continuamente.");

            Exercicio e6 = new Exercicio();
            e6.setNome("Flexão de Parede");
            e6.setSeries("3 x 10");
            e6.setCategoria("Força");
            e6.setNivel("Iniciante");
            e6.setContraIndicacao("punho");
            e6.setVideoUrl("https://www.youtube.com/watch?v=exemplo6");
            e6.setInstrucoes("Apoie as palmas das mãos na parede na altura dos ombros, incline o tronco à frente e empurre de volta com controle.");

            exercicioRepository.saveAll(List.of(e1, e2, e3, e4, e5, e6));
            System.out.println("✅ Catálogo inicial de exercícios 50+ carregado no MySQL!");
        }
    }
}