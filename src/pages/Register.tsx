import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { BrandLogo } from "../components/BrandLogo";
import { useUser } from "../contexts/UserContext";
import "../styles/OnboardingRegister.css";

interface Province {
  id: string;
  nombre: string;
}

interface Locality {
  id: string;
  nombre: string;
}

interface GeografResponse {
  provincias?: Province[];
  localidades?: Locality[];
}

type BinaryChoice = "yes" | "no";
type GlobalStep = 1 | 2 | 3 | 4;
type MotionDirection = "next" | "prev";

type MicroKind =
  | "name"
  | "birthDate"
  | "pronouns"
  | "schoolYear"
  | "email"
  | "confirmEmail"
  | "password"
  | "confirmPassword"
  | "topics"
  | "objectives"
  | "province"
  | "locality"
  | "doesSport"
  | "sportFrequency"
  | "therapyHistory"
  | "hasSiblings"
  | "siblingsCount"
  | "livesWith"
  | "activities"
  | "terms";

interface MicroStepConfig {
  id: string;
  globalStep: GlobalStep;
  kind: MicroKind;
}

const PRONOUN_OPTIONS = ["Ella", "El", "Elle", "Prefiero no decir"];
const SCHOOL_YEAR_OPTIONS = [
  "Estoy en la primaria",
  "Estoy en secundaria",
  "Ya finalice el colegio",
];

const TOPIC_OPTIONS = ["Ansiedad", "Estres escolar", "Autoestima", "Sueno", "Amistades", "Concentracion"];
const OBJECTIVE_OPTIONS = ["Sentirme mejor", "Entender mis emociones", "Armar habitos", "Pedir ayuda cuando la necesite"];
const SPORT_FREQUENCY_OPTIONS = ["Diario", "3 veces por semana", "Semanal", "Ocasional"];
const SIBLINGS_COUNT_OPTIONS = ["1", "2", "3", "4 o más"];
const LIVES_WITH_OPTIONS = ["Familia", "Amistades", "Docente", "Orientador/a", "Prefiero no decir"];
const ACTIVITY_OPTIONS = ["Arte", "Deporte", "Musica", "Juegos", "Lectura", "Tecnologia"];
const INPUT_LIMITS = {
  name: 60,
  email: 120,
  password: 64,
} as const;

const MICRO_STEPS: MicroStepConfig[] = [
  { id: "name", globalStep: 1, kind: "name" },
  { id: "birthDate", globalStep: 1, kind: "birthDate" },
  { id: "pronouns", globalStep: 1, kind: "pronouns" },
  { id: "schoolYear", globalStep: 1, kind: "schoolYear" },
  { id: "email", globalStep: 1, kind: "email" },
  { id: "confirmEmail", globalStep: 1, kind: "confirmEmail" },
  { id: "password", globalStep: 1, kind: "password" },
  { id: "confirmPassword", globalStep: 1, kind: "confirmPassword" },
  { id: "topics", globalStep: 2, kind: "topics" },
  { id: "objectives", globalStep: 2, kind: "objectives" },
  { id: "province", globalStep: 2, kind: "province" },
  { id: "locality", globalStep: 2, kind: "locality" },
  { id: "doesSport", globalStep: 3, kind: "doesSport" },
  { id: "sportFrequency", globalStep: 3, kind: "sportFrequency" },
  { id: "therapyHistory", globalStep: 3, kind: "therapyHistory" },
  { id: "hasSiblings", globalStep: 3, kind: "hasSiblings" },
  { id: "siblingsCount", globalStep: 3, kind: "siblingsCount" },
  { id: "livesWith", globalStep: 3, kind: "livesWith" },
  { id: "activities", globalStep: 4, kind: "activities" },
  { id: "terms", globalStep: 4, kind: "terms" },
];

const toggleArrayValue = (items: string[], value: string): string[] =>
  items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState<BinaryChoice | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValidationRequested, setConfirmPasswordValidationRequested] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingLocalities, setLoadingLocalities] = useState(false);

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const [doesSport, setDoesSport] = useState<BinaryChoice | "">("");
  const [sportFrequency, setSportFrequency] = useState("");
  const [therapyHistory, setTherapyHistory] = useState<BinaryChoice | "">("");
  const [hasSiblings, setHasSiblings] = useState<BinaryChoice | "">("");
  const [siblingsCount, setSiblingsCount] = useState("");
  const [livesWith, setLivesWith] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [anonymousDataEnabled, setAnonymousDataEnabled] = useState(false);
  const [researchConsentEnabled, setResearchConsentEnabled] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [motionDirection, setMotionDirection] = useState<MotionDirection>("next");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUserProfile } = useUser();
  const todayIso = useMemo(() => new Date().toISOString().split("T")[0], []);
  const stepIndexById = useMemo(
    () =>
      MICRO_STEPS.reduce<Record<string, number>>((acc, step, index) => {
        acc[step.id] = index;
        return acc;
      }, {}),
    [],
  );

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=24");
        if (!response.ok) {
          return;
        }

        const data: GeografResponse = await response.json();
        if (data.provincias) {
          setProvinces(data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre)));
        }
      } catch (fetchError) {
        console.error("Error al cargar provincias:", fetchError);
      } finally {
        setLoadingProvinces(false);
      }
    };

    void fetchProvinces();
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setLocalities([]);
      setSelectedLocality("");
      return;
    }

    const fetchLocalities = async () => {
      setLoadingLocalities(true);
      setSelectedLocality("");
      try {
        const response = await fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?provincia=${selectedProvince}&campos=id,nombre&max=500`,
        );

        if (!response.ok) {
          setLocalities([]);
          return;
        }

        const data: GeografResponse = await response.json();
        if (data.localidades) {
          setLocalities(data.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre)));
        } else {
          setLocalities([]);
        }
      } catch (fetchError) {
        console.error("Error al cargar localidades:", fetchError);
        setLocalities([]);
      } finally {
        setLoadingLocalities(false);
      }
    };

    void fetchLocalities();
  }, [selectedProvince]);

  useEffect(() => {
    setConfirmEmail("");
  }, [email]);

  useEffect(() => {
    setConfirmPassword("");
    setConfirmPasswordValidationRequested(false);
  }, [password]);

  const getBirthDateError = (value: string): string | null => {
    if (!value) {
      return "La fecha de nacimiento es obligatoria.";
    }

    const today = new Date();
    const birthDateValue = new Date(value);
    if (Number.isNaN(birthDateValue.getTime())) {
      return "Ingresa una fecha valida.";
    }

    if (birthDateValue > today) {
      return "La fecha no puede ser futura.";
    }

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 13);
    if (birthDateValue > minDate) {
      return "Debes tener al menos 13 años.";
    }

    return null;
  };

  const isStepVisible = (step: MicroStepConfig): boolean => {
    if (step.kind === "sportFrequency") {
      return doesSport === "yes";
    }
    if (step.kind === "siblingsCount") {
      return hasSiblings === "yes";
    }
    return true;
  };

  const findVisibleIndex = (startIndex: number, direction: 1 | -1): number | null => {
    for (
      let candidate = startIndex + direction;
      candidate >= 0 && candidate < MICRO_STEPS.length;
      candidate += direction
    ) {
      if (isStepVisible(MICRO_STEPS[candidate])) {
        return candidate;
      }
    }
    return null;
  };

  useEffect(() => {
    const current = MICRO_STEPS[activeIndex];
    if (!current || isStepVisible(current)) {
      return;
    }

    const fallback = findVisibleIndex(activeIndex, -1) ?? findVisibleIndex(activeIndex, 1) ?? 0;
    setActiveIndex(fallback);
  }, [activeIndex, doesSport, hasSiblings]);

  const currentStep = MICRO_STEPS[activeIndex];
  const nextVisibleIndex = findVisibleIndex(activeIndex, 1);
  const isFirstStep = activeIndex === 0;
  const isFinalVisibleStep = nextVisibleIndex === null;
  const showPrivacyBox = currentStep.globalStep === 4;
  const visibleSteps = useMemo(
    () =>
      MICRO_STEPS.filter((step) => {
        if (step.kind === "sportFrequency") {
          return doesSport === "yes";
        }
        if (step.kind === "siblingsCount") {
          return hasSiblings === "yes";
        }
        return true;
      }),
    [doesSport, hasSiblings],
  );
  const visibleStepCount = visibleSteps.length;

  const getCurrentStepValidity = (): boolean => {
    switch (currentStep.kind) {
      case "name":
        return name.trim().length >= 2;
      case "birthDate":
        return getBirthDateError(birthDate) === null;
      case "pronouns":
        return pronouns.trim().length > 0;
      case "schoolYear":
        return schoolYear.trim().length > 0;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      case "confirmEmail":
        return confirmEmail === "yes";
      case "password":
        return password.trim().length >= 6;
      case "confirmPassword":
        return confirmPassword.length > 0;
      case "topics":
        return selectedTopics.length > 0;
      case "objectives":
        return selectedObjectives.length > 0;
      case "province":
        return selectedProvince.length > 0;
      case "locality":
        return selectedLocality.length > 0;
      case "doesSport":
        return doesSport !== "";
      case "sportFrequency":
        return sportFrequency.length > 0;
      case "therapyHistory":
        return therapyHistory !== "";
      case "hasSiblings":
        return hasSiblings !== "";
      case "siblingsCount":
        return siblingsCount.length > 0;
      case "livesWith":
        return livesWith.length > 0;
      case "activities":
        return selectedActivities.length > 0;
      case "terms":
        return termsAccepted;
      default:
        return false;
    }
  };

  const stepIsValid = getCurrentStepValidity();
  const currentVisiblePosition = Math.max(1, visibleSteps.findIndex((step) => step.id === currentStep.id) + 1);
  const displayTotalSteps = Math.max(1, visibleStepCount);
  const displayCurrentStep = Math.min(displayTotalSteps, currentVisiblePosition);
  const globalProgress = Math.min(1, Math.max(0, displayCurrentStep / displayTotalSteps));

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError("");

    const birthDateError = getBirthDateError(birthDate);
    if (birthDateError) {
      setError(birthDateError);
      setLoading(false);
      return;
    }
    if (!selectedProvince) {
      setError("Debes seleccionar una provincia.");
      setLoading(false);
      return;
    }
    if (!selectedLocality) {
      setError("Debes seleccionar una localidad.");
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setError("Debes aceptar los terminos para continuar.");
      setLoading(false);
      return;
    }

    try {
      const provinceName = provinces.find((province) => province.id === selectedProvince)?.nombre ?? "";
      const localityName = localities.find((locality) => locality.id === selectedLocality)?.nombre ?? "";

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          birthDate,
          province: provinceName,
          locality: localityName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Error al registrarte");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      const resolvedName = data?.name || data?.user?.name || name.trim();
      const resolvedRole = data?.role || data?.user?.role || "user";
      localStorage.setItem("userName", resolvedName);
      localStorage.setItem("userRole", resolvedRole);
      setUserProfile({
        name: resolvedName,
        email: email.trim(),
        role: resolvedRole,
      });
      navigate("/home");
    } catch (registerError) {
      console.error("Error de conexion al registrar:", registerError);
      setError("Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    const previousVisibleIndex = findVisibleIndex(activeIndex, -1);
    if (previousVisibleIndex === null || loading) {
      return;
    }

    setError("");
    setMotionDirection("prev");
    setActiveIndex(previousVisibleIndex);
  };

  const handleBackAction = () => {
    if (loading) {
      return;
    }
    if (isFirstStep) {
      navigate("/login");
      return;
    }
    handlePrevious();
  };

  const handleContinue = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || !stepIsValid) {
      return;
    }

    if (currentStep.kind === "confirmPassword") {
      setConfirmPasswordValidationRequested(true);
      if (confirmPassword !== password) {
        return;
      }
    }

    setError("");
    if (isFinalVisibleStep) {
      await handleFinalSubmit();
      return;
    }

    if (nextVisibleIndex !== null) {
      setMotionDirection("next");
      setActiveIndex(nextVisibleIndex);
    }
  };

  const goToStep = (stepId: string) => {
    const targetIndex = stepIndexById[stepId];
    if (typeof targetIndex !== "number") {
      return;
    }
    setMotionDirection(targetIndex < activeIndex ? "prev" : "next");
    setActiveIndex(targetIndex);
  };

  const updateBinaryChoice = (value: BinaryChoice, onChange: (selected: BinaryChoice) => void) => {
    setError("");
    onChange(value);
  };

  const renderBinaryChoices = (
    value: BinaryChoice | "",
    onChange: (selected: BinaryChoice) => void,
    yesLabel = "Sí",
    noLabel = "No",
  ) => (
    <div className="ob-row-2">
      <button
        type="button"
        className={`ob-choice ${value === "yes" ? "is-selected" : ""}`}
        onClick={() => updateBinaryChoice("yes", onChange)}
      >
        <span>{yesLabel}</span>
        {value === "yes" && <CheckCircle2 aria-hidden />}
      </button>
      <button
        type="button"
        className={`ob-choice ${value === "no" ? "is-selected" : ""}`}
        onClick={() => updateBinaryChoice("no", onChange)}
      >
        <span>{noLabel}</span>
        {value === "no" && <CheckCircle2 aria-hidden />}
      </button>
    </div>
  );

  const renderCurrentControl = () => {
    switch (currentStep.kind) {
      case "name":
        return (
          <input
            className="ob-input"
            type="text"
            value={name}
            placeholder="Tu nombre"
            autoComplete="name"
            maxLength={INPUT_LIMITS.name}
            onChange={(event) => {
              setName(event.target.value.slice(0, INPUT_LIMITS.name));
              setError("");
            }}
          />
        );

      case "birthDate": {
        const birthDateError = birthDate ? getBirthDateError(birthDate) : null;
        return (
          <>
            <input
              className="ob-input ob-input--date"
              type="date"
              value={birthDate}
              max={todayIso}
              onChange={(event) => {
                setBirthDate(event.target.value);
                setError("");
              }}
            />
            {birthDateError ? <p className="ob-inline-error">{birthDateError}</p> : null}
          </>
        );
      }

      case "pronouns":
        return (
          <div className="ob-select-wrap">
            <Select
              showSearch
              value={pronouns || undefined}
              placeholder="Selecciona"
              onChange={(value) => {
                setPronouns(value || "");
                setError("");
              }}
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={PRONOUN_OPTIONS.map((option) => ({ value: option, label: option }))}
            />
          </div>
        );

      case "schoolYear":
        return (
          <div className="ob-chips">
            {SCHOOL_YEAR_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`ob-chip ${schoolYear === option ? "is-on" : ""}`}
                onClick={() => {
                  setSchoolYear(option);
                  setError("");
                }}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case "email":
        return (
          <input
            className="ob-input"
            type="email"
            value={email}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
            maxLength={INPUT_LIMITS.email}
            onChange={(event) => {
              setEmail(event.target.value.slice(0, INPUT_LIMITS.email));
              setError("");
            }}
          />
        );

      case "confirmEmail":
        return (
          <>
            <p className="ob-single-option ob-single-option--boxed">{email || "No ingresaste correo"}</p>
            {renderBinaryChoices(confirmEmail, setConfirmEmail, "Sí, es correcto", "No, quiero corregir")}
            {confirmEmail === "no" ? (
              <button type="button" className="ob-inline-link" onClick={() => goToStep("email")}>
                Volver a editar correo
              </button>
            ) : null}
          </>
        );

      case "password":
        return (
          <input
            className="ob-input"
            type="password"
            value={password}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            maxLength={INPUT_LIMITS.password}
            onChange={(event) => {
              setPassword(event.target.value.slice(0, INPUT_LIMITS.password));
              setError("");
            }}
          />
        );

      case "confirmPassword":
        return (
          <>
            <input
              className="ob-input"
              type="password"
              value={confirmPassword}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              maxLength={INPUT_LIMITS.password}
              onChange={(event) => {
                setConfirmPassword(event.target.value.slice(0, INPUT_LIMITS.password));
                setConfirmPasswordValidationRequested(false);
                setError("");
              }}
            />
            {confirmPasswordValidationRequested && confirmPassword.length > 0 && confirmPassword !== password ? (
              <p className="ob-inline-error">Las contraseñas no coinciden.</p>
            ) : null}
          </>
        );

      case "topics":
        return (
          <div className="ob-chips">
            {TOPIC_OPTIONS.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`ob-chip ${selectedTopics.includes(topic) ? "is-on" : ""}`}
                onClick={() => {
                  setSelectedTopics((prev) => toggleArrayValue(prev, topic));
                  setError("");
                }}
              >
                {topic}
              </button>
            ))}
          </div>
        );

      case "objectives":
        return (
          <>
            <div className="ob-chips">
              {OBJECTIVE_OPTIONS.map((objective) => {
                const selected = selectedObjectives.includes(objective);
                const maxReached = selectedObjectives.length >= 2 && !selected;
                return (
                  <button
                    key={objective}
                    type="button"
                    className={`ob-chip ${selected ? "is-on" : ""}`}
                    disabled={maxReached}
                    onClick={() => {
                      setSelectedObjectives((prev) => toggleArrayValue(prev, objective));
                      setError("");
                    }}
                  >
                    {objective}
                  </button>
                );
              })}
            </div>
            <p className="ob-inline-hint">Puedes elegir hasta 2 objetivos.</p>
          </>
        );

      case "province":
        return (
          <div className="ob-select-wrap">
            <Select
              showSearch
              value={selectedProvince || undefined}
              placeholder={loadingProvinces ? "Cargando provincias..." : "Selecciona o busca una provincia"}
              onChange={(value) => {
                setSelectedProvince(value || "");
                setError("");
              }}
              disabled={loadingProvinces}
              loading={loadingProvinces}
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={provinces.map((province) => ({
                value: province.id,
                label: province.nombre,
              }))}
            />
          </div>
        );

      case "locality":
        return (
          <div className="ob-select-wrap">
            <Select
              showSearch
              value={selectedLocality || undefined}
              placeholder={
                loadingLocalities
                  ? "Cargando localidades..."
                  : !selectedProvince
                    ? "Primero selecciona una provincia"
                    : "Selecciona o busca una localidad"
              }
              onChange={(value) => {
                setSelectedLocality(value || "");
                setError("");
              }}
              disabled={loadingLocalities || !selectedProvince}
              loading={loadingLocalities}
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={localities.map((locality) => ({
                value: locality.id,
                label: locality.nombre,
              }))}
            />
          </div>
        );

      case "doesSport":
        return renderBinaryChoices(doesSport, setDoesSport, "Sí", "No");

      case "sportFrequency":
        return (
          <div className="ob-chips">
            {SPORT_FREQUENCY_OPTIONS.map((frequency) => (
              <button
                key={frequency}
                type="button"
                className={`ob-chip ${sportFrequency === frequency ? "is-on" : ""}`}
                onClick={() => {
                  setSportFrequency(frequency);
                  setError("");
                }}
              >
                {frequency}
              </button>
            ))}
          </div>
        );

      case "therapyHistory":
        return renderBinaryChoices(therapyHistory, setTherapyHistory, "Sí", "No");

      case "hasSiblings":
        return renderBinaryChoices(hasSiblings, setHasSiblings, "Sí", "No");

      case "siblingsCount":
        return (
          <div className="ob-chips">
            {SIBLINGS_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                type="button"
                className={`ob-chip ${siblingsCount === count ? "is-on" : ""}`}
                onClick={() => {
                  setSiblingsCount(count);
                  setError("");
                }}
              >
                {count}
              </button>
            ))}
          </div>
        );

      case "livesWith":
        return (
          <div className="ob-chips">
            {LIVES_WITH_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`ob-chip ${livesWith === option ? "is-on" : ""}`}
                onClick={() => {
                  setLivesWith(option);
                  setError("");
                }}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case "activities":
        return (
          <div className="ob-chips">
            {ACTIVITY_OPTIONS.map((activity) => (
              <button
                key={activity}
                type="button"
                className={`ob-chip ${selectedActivities.includes(activity) ? "is-on" : ""}`}
                onClick={() => {
                  setSelectedActivities((prev) => toggleArrayValue(prev, activity));
                  setError("");
                }}
              >
                {activity}
              </button>
            ))}
          </div>
        );

      case "terms":
        return (
          <div className="ob-consent-stack">
            <label className="ob-consent-row" htmlFor="terms-consent">
              <img className="ob-consent-row__icon" src="/icons/file.png" alt="" />
              <input
                id="terms-consent"
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => {
                  setTermsAccepted(event.target.checked);
                  setError("");
                }}
              />
              <span>
                Acepto los <strong>Terminos de uso</strong> y la <strong>Politica de privacidad</strong>.
              </span>
            </label>

            <label className="ob-consent-row ob-consent-row--compact" htmlFor="anonymous-data-consent">
              <input
                id="anonymous-data-consent"
                type="checkbox"
                checked={anonymousDataEnabled}
                onChange={(event) => {
                  setAnonymousDataEnabled(event.target.checked);
                }}
              />
              <span>
                <strong>Opcional:</strong> compartir datos anonimos para mejorar el servicio.
              </span>
            </label>

            <label className="ob-consent-row ob-consent-row--compact" htmlFor="research-consent">
              <input
                id="research-consent"
                type="checkbox"
                checked={researchConsentEnabled}
                onChange={(event) => {
                  setResearchConsentEnabled(event.target.checked);
                }}
              />
              <span>
                <strong>Opcional:</strong> participar en estudios de mejora.
              </span>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  const getCardTitle = (): string => {
    switch (currentStep.kind) {
      case "name":
        return "¿Cómo te llamás?";
      case "birthDate": {
        const cleanName = name.trim();
        return cleanName
          ? `${cleanName}, ¿cuál es tu fecha de nacimiento?`
          : "¿Cuál es tu fecha de nacimiento?";
      }
      case "pronouns":
        return "¿Cuáles son tus pronombres?";
      case "schoolYear":
        return "¿En qué año escolar estás?";
      case "email":
        return "¿Cuál es tu correo electrónico?";
      case "confirmEmail":
        return "Confirmación de correo";
      case "password":
        return "Crea tu contraseña";
      case "confirmPassword":
        return "Repite tu contraseña";
      case "topics":
        return "¿Qué temas te interesan?";
      case "objectives":
        return "¿Cuál es tu objetivo principal?";
      case "province":
        return "Selecciona tu provincia";
      case "locality":
        return "Selecciona tu localidad";
      case "doesSport":
        return "¿Haces actividad física?";
      case "sportFrequency":
        return "¿Con qué frecuencia entrenas?";
      case "therapyHistory":
        return "¿Tuviste espacios de apoyo antes?";
      case "hasSiblings":
        return "¿Tienes hermanos/as?";
      case "siblingsCount":
        return "¿Cuántos hermanos/as tienes?";
      case "livesWith":
        return "¿Con quién te sientes más cómodo/a?";
      case "activities":
        return "¿Qué actividades te ayudan?";
      case "terms":
        return "Condiciones de uso y privacidad";
      default:
        return "Completa este paso";
    }
  };

  const getCardHint = (): string => {
    switch (currentStep.kind) {
      case "name":
        return "Tu nombre nos ayuda a personalizar tu experiencia y acompañarte mejor.";
      case "birthDate":
        return "Necesitamos confirmar que tengas al menos 13 años.";
      case "pronouns":
      case "schoolYear":
      case "province":
      case "locality":
        return "Elige una opción para continuar.";
      case "email":
        return "Lo usamos para iniciar sesión y recuperar tu cuenta.";
      case "confirmEmail":
        return "Necesitamos confirmar que el correo esté correcto.";
      case "password":
        return "Usa al menos 6 caracteres.";
      case "confirmPassword":
        return "Debe coincidir con la contraseña anterior.";
      case "topics":
      case "activities":
        return "Selección múltiple. Puedes elegir varias opciones.";
      case "objectives":
        return "Selección múltiple. Elige hasta dos.";
      case "doesSport":
      case "therapyHistory":
      case "hasSiblings":
        return "Elige la opción que mejor te represente.";
      case "sportFrequency":
      case "siblingsCount":
      case "livesWith":
        return "Elige una opción para avanzar.";
      case "terms":
        return "Necesitamos tu aceptacion para crear la cuenta. Los consentimientos extras son opcionales.";
      default:
        return "";
    }
  };

  return (
    <main className="register-v2">
      <section className="register-v2__frame">
        <form className="register-v2__form" onSubmit={handleContinue}>
          <header className="register-v2__top">
            <button
              type="button"
              className="register-v2__mobile-back"
              onClick={handleBackAction}
              aria-label="Volver"
              disabled={loading}
            >
              <ChevronLeft size={24} aria-hidden />
            </button>

            <div className="register-v2__brand">
              <BrandLogo />
            </div>

            <div className="register-v2__progress-wrap">
              <p className="register-v2__step-label">
                Paso {displayCurrentStep} de {displayTotalSteps}
              </p>
              <div
                className="register-v2__progress"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={visibleStepCount}
                aria-valuenow={currentVisiblePosition}
              >
                <span className="register-v2__progress-fill" style={{ transform: `scaleX(${globalProgress})` }} />
              </div>
            </div>

            <button
              type="button"
              className="register-v2__login-link"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Iniciar sesión
            </button>
          </header>

          {error ? <div className="auth-error register-v2__error">{error}</div> : null}

          <div className="register-v2__body">
            <article
              key={`${currentStep.id}-${activeIndex}`}
              className={`register-v2__focus ob-focus-card ${motionDirection === "next" ? "is-next" : "is-prev"}`}
            >
              <div className="register-v2__copy">
                <h1 className="register-v2__title">{getCardTitle()}</h1>
                <p className="register-v2__subtitle">
                  {currentStep.kind === "name" ? (
                    <>
                      <span className="register-v2__subtitle-desktop-copy">
                        Tu nombre nos ayuda a <strong>personalizar tu experiencia</strong> y acompañarte mejor.
                      </span>
                      <span className="register-v2__subtitle-mobile-copy">
                        Tu nombre es cómo te identificamos en <strong>Mentesana.</strong>
                      </span>
                    </>
                  ) : (
                    getCardHint()
                  )}
                </p>
              </div>
              <div className="ob-control-wrap">{renderCurrentControl()}</div>
            </article>
          </div>

          <div className="register-v2__actions-desktop">
            <button type="button" className="register-v2__back-link" onClick={handleBackAction} disabled={loading}>
              <ChevronLeft size={20} aria-hidden />
              Atrás
            </button>

            <button type="submit" className="register-v2__next-btn" disabled={loading || !stepIsValid}>
              {loading ? "Guardando..." : isFinalVisibleStep ? "Crear mi espacio" : "Siguiente"}
              {!loading ? <ChevronRight size={20} aria-hidden /> : null}
            </button>
          </div>

          <div className="register-v2__actions-mobile">
            <button
              type="button"
              className="register-v2__circle register-v2__circle--ghost"
              onClick={handleBackAction}
              disabled={loading}
              aria-label="Anterior"
            >
              <ChevronLeft size={28} aria-hidden />
            </button>

            <button
              type="submit"
              className="register-v2__circle register-v2__circle--primary"
              disabled={loading || !stepIsValid}
              aria-label={isFinalVisibleStep ? "Crear mi espacio" : "Siguiente"}
            >
              <ChevronRight size={28} aria-hidden />
            </button>
          </div>

          <aside className={`register-v2__safety-pill ${showPrivacyBox ? "is-visible" : ""}`}>
            <img src="/icons/security.png" alt="" />
            <span>
              Tu información está segura y es confidencial.
              <strong> Conocé cómo protegemos tus datos.</strong>
            </span>
          </aside>

         
        </form>

        <img className="register-v2__hero register-v2__hero--desktop" src="/landing/landing_component2.png" alt="" />
        <img className="register-v2__deco register-v2__deco--heart" src="/elementos/heart.png" alt="" />
        <img className="register-v2__deco register-v2__deco--sparkle-yellow" src="/landing/yellow_sparkle.png" alt="" />
        <img className="register-v2__deco register-v2__deco--sparkle-purple" src="/landing/coral_sparkle.png" alt="" />
        <img className="register-v2__deco register-v2__deco--flower" src="/landing/star.png" alt="" />
      </section>
    </main>
  );
};

export default Register;



